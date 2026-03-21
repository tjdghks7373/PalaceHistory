import re
import requests
from bs4 import BeautifulSoup
from playwright.async_api import async_playwright, Browser, BrowserContext

PALACE_COLLECTION_URL = "https://shop-usa.palaceskateboards.com/collections/new"
EXCHANGE_API = "https://api.frankfurter.app/latest?from=USD&to=KRW"

CUSTOMS_RATE = 1.13
VAT_RATE = 1.10
DUTY_FREE_KRW = 200000


def get_exchange_rate() -> float:
    resp = requests.get(EXCHANGE_API, timeout=10)
    data = resp.json()
    return data["rates"]["KRW"]


def usd_to_krw(price_usd: float, rate: float) -> float:
    krw = price_usd * rate
    if krw > DUTY_FREE_KRW:
        krw = krw * CUSTOMS_RATE * VAT_RATE
    return round(krw)


async def _new_context(browser: Browser) -> BrowserContext:
    return await browser.new_context(
        locale="en-US",
        timezone_id="America/New_York",
    )


async def fetch_products(browser: Browser) -> list[dict]:
    context = await _new_context(browser)
    page = await context.new_page()

    await page.goto(PALACE_COLLECTION_URL, wait_until="networkidle", timeout=30000)

    # 페이지 끝까지 스크롤해서 모든 제품 로드
    prev_count = 0
    while True:
        await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        await page.wait_for_timeout(1500)
        count = await page.eval_on_selector_all('a[href*="/products/"]', "els => els.length")
        if count == prev_count:
            break
        prev_count = count

    cards = await page.eval_on_selector_all(
        'a[href*="/products/"]',
        """els => els.map(e => {
            const text = e.innerText.trim();
            const priceMatch = text.match(/\$([\\d,]+(?:\\.\\d+)?)/);
            const img = e.querySelector('img');
            const soldOut = e.querySelector('[class*="sold"]') !== null
                         || e.innerText.toLowerCase().includes('sold out');
            const lines = text.split('\\n').map(l => l.trim()).filter(Boolean);
            return {
                href: e.href,
                name: lines[0] || '',
                price_text: priceMatch ? priceMatch[1] : '0',
                image_url: img ? img.src.replace(/width=\\d+&height=\\d+&crop=center/, 'width=800') : '',
                sold_out: soldOut,
            };
        })""",
    )

    seen = set()
    products = []
    for c in cards:
        href = c.get("href", "")
        handle = href.rstrip("/").split("/products/")[-1]
        if not handle or handle in seen:
            continue
        seen.add(handle)

        price_usd = float(c["price_text"].replace(",", "") or 0)
        products.append({
            "shopify_id": handle,
            "handle": handle,
            "name": c["name"],
            "price_gbp": price_usd,
            "image_url": c["image_url"],
            "product_url": href,
            "available": not c["sold_out"],
        })

    await page.close()
    await context.close()
    return products


async def fetch_size_chart(browser: Browser, handle: str) -> dict | None:
    url = f"https://shop-usa.palaceskateboards.com/products/{handle}"
    context = await _new_context(browser)
    page = await context.new_page()
    try:
        await page.goto(url, wait_until="networkidle", timeout=20000)

        size_chart_btn = page.get_by_text("Size Chart", exact=False)
        if await size_chart_btn.count() == 0:
            return None

        await size_chart_btn.first.click()
        await page.wait_for_selector("table", timeout=5000)

        html = await page.content()
        soup = BeautifulSoup(html, "lxml")
        table = soup.find("table")
        if not table:
            return None

        headers = [th.get_text(strip=True) for th in table.find_all("th")]
        rows = []
        for tr in table.find_all("tr"):
            cells = [td.get_text(strip=True) for td in tr.find_all("td")]
            if cells:
                rows.append(cells)

        if not headers and rows:
            headers = rows.pop(0)

        if not headers or not rows:
            return None

        return {"headers": headers, "rows": rows}
    except Exception:
        return None
    finally:
        await page.close()
        await context.close()


async def crawl() -> dict:
    rate = get_exchange_rate()

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        products = await fetch_products(browser)

        for product in products:
            product["price_krw"] = usd_to_krw(product["price_gbp"], rate)
            product["size_chart"] = await fetch_size_chart(browser, product["handle"])

        await browser.close()

    return {"exchange_rate": rate, "products": products}
