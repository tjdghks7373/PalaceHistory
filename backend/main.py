import os
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import get_db, engine
from models import Base, CrawlSession, Product
from scheduler import run_crawl

Base.metadata.create_all(bind=engine)

app = FastAPI(title="PalaceHistory API")

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"status": "ok", "service": "PalaceHistory API"}


@app.get("/weeks")
def get_weeks(db: Session = Depends(get_db)):
    sessions = db.query(CrawlSession).order_by(CrawlSession.id.desc()).all()
    return [
        {
            "id": s.id,
            "week_label": s.week_label,
            "crawled_at": s.crawled_at,
            "exchange_rate": s.exchange_rate,
            "product_count": len(s.products),
        }
        for s in sessions
    ]


@app.get("/products")
def get_products(week: str, db: Session = Depends(get_db)):
    session = db.query(CrawlSession).filter(
        CrawlSession.week_label == week
    ).first()
    if not session:
        raise HTTPException(status_code=404, detail="Week not found")

    products = db.query(Product).filter(Product.session_id == session.id).all()
    return {
        "week_label": session.week_label,
        "exchange_rate": session.exchange_rate,
        "crawled_at": session.crawled_at,
        "products": [
            {
                "id": p.id,
                "shopify_id": p.shopify_id,
                "name": p.name,
                "price_gbp": p.price_gbp,
                "price_krw": p.price_krw,
                "image_url": p.image_url,
                "product_url": p.product_url,
                "available": p.available,
                "is_new": p.is_new,
                "size_chart": p.size_chart,
            }
            for p in products
        ],
    }


@app.post("/crawl")
async def trigger_crawl():
    """수동으로 크롤링 트리거 (관리자용)"""
    await run_crawl()
    return {"message": "Crawl triggered successfully"}


@app.get("/debug-crawl")
async def debug_crawl():
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(locale="en-US", timezone_id="America/New_York")
        page = await context.new_page()
        await page.goto("https://shop.palaceskateboards.com/collections/new", wait_until="networkidle", timeout=30000)
        cards = await page.eval_on_selector_all(
            'a[href*="/products/"]',
            """els => els.slice(0, 3).map(e => ({
                href: e.href,
                text: e.innerText.trim().slice(0, 200),
            }))"""
        )
        await browser.close()
    return {"cards": cards}
