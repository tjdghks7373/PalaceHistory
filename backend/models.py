from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from database import Base


class CrawlSession(Base):
    __tablename__ = "crawl_sessions"

    id = Column(Integer, primary_key=True, index=True)
    week_label = Column(String, unique=True, index=True)  # e.g., "2026-W11"
    crawled_at = Column(DateTime, default=datetime.utcnow)
    exchange_rate = Column(Float)

    products = relationship("Product", back_populates="session")


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("crawl_sessions.id"))
    shopify_id = Column(String, index=True)
    name = Column(String)
    handle = Column(String)
    price_gbp = Column(Float)
    price_krw = Column(Float)
    image_url = Column(String)
    product_url = Column(String)
    available = Column(Boolean, default=True)
    is_new = Column(Boolean, default=False)
    size_chart = Column(JSON, nullable=True)

    session = relationship("CrawlSession", back_populates="products")
