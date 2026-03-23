import requests
from datetime import datetime, timedelta

from database import SessionLocal
from models import CrawlSession, Product

PALACE_PRODUCTS_URL = "https://shop-usa.palaceskateboards.com/collections/new/products.json"
CUSTOMS_RATE = 1.13
VAT_RATE = 1.10
DUTY_FREE_KRW = 200000


def get_iso_week_label(date: datetime) -> str:
    year, week, _ = date.isocalendar()
    return f"{year}-W{week:02d}"


def get_historical_exchange_rate(date: datetime) -> float:
    date_str = date.strftime("%Y-%m-%d")
    try:
        resp = requests.get(
            f"https://api.frankfurter.app/{date_str}?from=USD&to=KRW", timeout=10
        )
        return resp.json()["rates"]["KRW"]
    except Exception:
        resp = requests.get(
            "https://api.frankfurter.app/latest?from=USD&to=KRW", timeout=10
        )
        return resp.json()["rates"]["KRW"]


def find_wayback_snapshot(date: datetime) -> str | None:
    """드롭 당일 정오 이후 ~ 다음 월요일 사이 스냅샷 탐색"""
    ts_from = date.strftime("%Y%m%d120000")
    ts_to = (date + timedelta(days=3)).strftime("%Y%m%d000000")
    cdx_url = (
        f"http://web.archive.org/cdx/search/cdx"
        f"?url={PALACE_PRODUCTS_URL}&limit=250"
        f"&output=json&fl=timestamp,statuscode"
        f"&filter=statuscode:200"
        f"&from={ts_from}&to={ts_to}"
    )
    try:
        resp = requests.get(cdx_url, timeout=20)
        data = resp.json()
        if len(data) <= 1:
            return None
        # 스냅샷 중 가장 이른 것 반환
        return data[1][0]
    except Exception:
        return None


def fetch_products_from_wayback(timestamp: str) -> list[dict]:
    """Wayback Machine에서 아카이브된 Shopify JSON 파싱"""
    url = f"https://web.archive.org/web/{timestamp}if_/{PALACE_PRODUCTS_URL}?limit=250"
    try:
        resp = requests.get(url, timeout=30)
        data = resp.json()
        products = []
        for p in data.get("products", []):
            available = any(v.get("available", False) for v in p.get("variants", []))
            price_usd = float(p["variants"][0]["price"]) if p.get("variants") else 0
            image_url = p["images"][0]["src"] if p.get("images") else ""

            products.append({
                "shopify_id": str(p["id"]),
                "handle": p["handle"],
                "name": p["title"],
                "price_gbp": price_usd,
                "image_url": image_url,
                "product_url": f"https://shop-usa.palaceskateboards.com/products/{p['handle']}",
                "available": available,
            })
        return products
    except Exception as e:
        print(f"[BulkCrawl] Wayback fetch error ({timestamp}): {e}")
        return []


def usd_to_krw(price_usd: float, rate: float) -> float:
    krw = price_usd * rate
    if krw > DUTY_FREE_KRW:
        krw = krw * CUSTOMS_RATE * VAT_RATE
    return round(krw)


def get_fridays(start: datetime, end: datetime) -> list[datetime]:
    fridays = []
    current = start
    while current <= end:
        if current.weekday() == 4:  # 금요일
            fridays.append(current)
        current += timedelta(days=1)
    return fridays


async def bulk_crawl(start_date: datetime, end_date: datetime) -> dict:
    db = SessionLocal()
    results = []
    prev_product_ids: set[str] = set()

    # 가장 오래된 기존 세션 이전 제품 ID 초기화
    first_session = db.query(CrawlSession).order_by(CrawlSession.id.asc()).first()
    if first_session:
        first_products = db.query(Product).filter(
            Product.session_id == first_session.id
        ).all()
        prev_product_ids = {p.shopify_id for p in first_products}

    try:
        fridays = get_fridays(start_date, end_date)
        print(f"[BulkCrawl] 대상 금요일 {len(fridays)}개: "
              f"{[f.strftime('%Y-%m-%d') for f in fridays]}")

        for friday in fridays:
            week_label = get_iso_week_label(friday)
            date_str = friday.strftime("%Y-%m-%d")

            existing = db.query(CrawlSession).filter(
                CrawlSession.week_label == week_label
            ).first()
            if existing:
                print(f"[BulkCrawl] {week_label} 이미 존재, 건너뜀")
                prev_prods = db.query(Product).filter(
                    Product.session_id == existing.id
                ).all()
                prev_product_ids = {p.shopify_id for p in prev_prods}
                results.append({"week": week_label, "date": date_str, "status": "skipped"})
                continue

            print(f"[BulkCrawl] {week_label} ({date_str}) 처리 중...")

            snapshot_ts = find_wayback_snapshot(friday)
            if not snapshot_ts:
                print(f"[BulkCrawl] {week_label} 스냅샷 없음")
                results.append({"week": week_label, "date": date_str, "status": "no_snapshot"})
                continue

            print(f"[BulkCrawl] 스냅샷 발견: {snapshot_ts}")

            products = fetch_products_from_wayback(snapshot_ts)
            if not products:
                print(f"[BulkCrawl] {week_label} 제품 없음")
                results.append({"week": week_label, "date": date_str, "status": "no_products"})
                continue

            rate = get_historical_exchange_rate(friday)

            session = CrawlSession(
                week_label=week_label,
                exchange_rate=rate,
                crawled_at=friday,
            )
            db.add(session)
            db.flush()

            for p in products:
                db.add(Product(
                    session_id=session.id,
                    shopify_id=p["shopify_id"],
                    handle=p["handle"],
                    name=p["name"],
                    price_gbp=p["price_gbp"],
                    price_krw=usd_to_krw(p["price_gbp"], rate),
                    image_url=p["image_url"],
                    product_url=p["product_url"],
                    available=p["available"],
                    is_new=(p["shopify_id"] not in prev_product_ids),
                    size_chart=None,
                ))

            db.commit()
            prev_product_ids = {p["shopify_id"] for p in products}

            print(f"[BulkCrawl] {week_label} 저장 완료: {len(products)}개")
            results.append({
                "week": week_label,
                "date": date_str,
                "status": "success",
                "count": len(products),
            })

    except Exception as e:
        db.rollback()
        print(f"[BulkCrawl] 오류: {e}")
        raise
    finally:
        db.close()

    return {"results": results}
