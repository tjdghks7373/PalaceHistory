import os
from datetime import datetime
from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
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


class BulkCrawlRequest(BaseModel):
    start_date: str = "2026-01-02"
    end_date: str = "2026-03-21"


@app.post("/bulk-crawl")
async def start_bulk_crawl(request: BulkCrawlRequest, background_tasks: BackgroundTasks):
    """Wayback Machine으로 과거 주차 데이터 일괄 수집"""
    from bulk_crawl import bulk_crawl
    start = datetime.strptime(request.start_date, "%Y-%m-%d")
    end = datetime.strptime(request.end_date, "%Y-%m-%d")
    background_tasks.add_task(bulk_crawl, start, end)
    return {"message": f"Bulk crawl 시작: {request.start_date} ~ {request.end_date} (Render 로그에서 진행상황 확인)"}


@app.delete("/weeks/{week_label}")
def delete_week(week_label: str, db: Session = Depends(get_db)):
    session = db.query(CrawlSession).filter(CrawlSession.week_label == week_label).first()
    if not session:
        raise HTTPException(status_code=404, detail="Week not found")
    db.query(Product).filter(Product.session_id == session.id).delete()
    db.delete(session)
    db.commit()
    return {"message": f"{week_label} 삭제 완료"}


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
