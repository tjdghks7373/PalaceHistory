import asyncio
import traceback
from datetime import datetime
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger

from crawler import crawl
from database import SessionLocal
from models import CrawlSession, Product


def get_week_label() -> str:
    now = datetime.utcnow()
    return f"{now.year}-W{now.isocalendar()[1]:02d}"


async def run_crawl():
    db = SessionLocal()
    try:
        week_label = get_week_label()

        existing = db.query(CrawlSession).filter(
            CrawlSession.week_label == week_label
        ).first()
        if existing:
            print(f"[Scheduler] Already crawled for {week_label}, skipping.")
            return

        prev_session = db.query(CrawlSession).order_by(CrawlSession.id.desc()).first()
        prev_product_ids: set[str] = set()
        if prev_session:
            prev_products = db.query(Product).filter(
                Product.session_id == prev_session.id
            ).all()
            prev_product_ids = {p.shopify_id for p in prev_products}

        print(f"[Scheduler] Crawling for {week_label}...")
        data = await crawl()

        session = CrawlSession(
            week_label=week_label,
            exchange_rate=data["exchange_rate"],
        )
        db.add(session)
        db.flush()

        for p in data["products"]:
            product = Product(
                session_id=session.id,
                is_new=(p["shopify_id"] not in prev_product_ids),
                **p,
            )
            db.add(product)

        db.commit()
        print(f"[Scheduler] Saved {len(data['products'])} products for {week_label}")

    except Exception as e:
        db.rollback()
        print(f"[Scheduler] Crawl error: {e}")
        traceback.print_exc()
    finally:
        db.close()


scheduler = AsyncIOScheduler()


def start_scheduler():
    scheduler.add_job(
        run_crawl,
        CronTrigger(day_of_week="mon", hour=0, minute=0),
        id="weekly_crawl",
        replace_existing=True,
    )
    scheduler.start()
    print("[Scheduler] Started. Weekly crawl every Monday 00:00 UTC.")
