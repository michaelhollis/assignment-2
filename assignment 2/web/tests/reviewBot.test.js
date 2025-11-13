import assert from "node:assert/strict";
import { setupReviewBot, businesses } from "../script.js";

class FakeElement {
  constructor({ id = null, classNames = [], dataset = {}, tagName = "div" } = {}) {
    this.id = id;
    this.tagName = tagName;
    this.classList = new Set(classNames);
    this.dataset = { ...dataset };
    this.children = [];
    this.parentElement = null;
    this.listeners = new Map();
    this.hidden = false;
    this.textContent = "";
    this._innerHTML = "";
  }

  get innerHTML() {
    return this._innerHTML;
  }

  set innerHTML(value) {
    this._innerHTML = value;
    if (value === "") {
      this.children = [];
    }
  }

  appendChild(child) {
    child.parentElement = this;
    this.children.push(child);
    return child;
  }

  addEventListener(type, handler) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, []);
    }
    this.listeners.get(type).push(handler);
  }

  dispatchEvent(type, event) {
    const handlers = this.listeners.get(type) ?? [];
    handlers.forEach((handler) => handler(event));
  }

  querySelectorAll(selector) {
    const results = [];

    for (const child of this.children) {
      if (matchesSelector(child, selector)) {
        results.push(child);
      }
      results.push(...child.querySelectorAll(selector));
    }

    return results;
  }

  querySelector(selector) {
    return this.querySelectorAll(selector)[0] ?? null;
  }

  removeAttribute(attribute) {
    if (attribute.startsWith("data-")) {
      const key = attribute
        .replace(/^data-/, "")
        .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
      delete this.dataset[key];
    }
  }

  focus() {
    if (this.ownerDocument) {
      this.ownerDocument.activeElement = this;
    }
  }
}

class FakeDocument {
  constructor() {
    this.body = new FakeElement({ tagName: "body" });
    this.elementsById = new Map();
    this.activeElement = null;
    this.listeners = new Map();
  }

  register(element) {
    element.ownerDocument = this;
    if (element.id) {
      this.elementsById.set(element.id, element);
    }
    if (!element.parentElement) {
      this.body.appendChild(element);
    }
    element.children.forEach((child) => this.register(child));
  }

  createElement(tagName) {
    const el = new FakeElement({ tagName });
    el.ownerDocument = this;
    return el;
  }

  getElementById(id) {
    return this.elementsById.get(id) ?? null;
  }

  querySelectorAll(selector) {
    const results = [];
    for (const child of this.body.children) {
      if (matchesSelector(child, selector)) {
        results.push(child);
      }
      results.push(...child.querySelectorAll(selector));
    }
    return results;
  }

  addEventListener(type, handler) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, []);
    }
    this.listeners.get(type).push(handler);
  }

  dispatchEvent(type, event) {
    const handlers = this.listeners.get(type) ?? [];
    handlers.forEach((handler) => handler(event));
  }
}

function matchesSelector(element, selector) {
  if (selector.startsWith(".")) {
    return element.classList.has(selector.slice(1));
  }

  if (selector.startsWith("#")) {
    return element.id === selector.slice(1);
  }

  if (selector.startsWith("[")) {
    const match = selector.match(/^\[data-([^=\]]+)="?([^\]"]+)"?\]$/);
    if (match) {
      const [, dataKey, value] = match;
      const camelKey = dataKey.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
      return element.dataset[camelKey] === value;
    }
  }

  return element.tagName.toLowerCase() === selector.toLowerCase();
}

function buildTestDocument() {
  const doc = new FakeDocument();

  const overlay = new FakeElement({ id: "review-bot", classNames: ["bot-overlay"] });
  overlay.hidden = true;
  const botWindow = new FakeElement({ classNames: ["bot-window"] });
  const header = new FakeElement({ classNames: ["bot-header"] });
  const heading = new FakeElement({ id: "bot-heading" });
  const subheading = new FakeElement({ id: "bot-subheading" });
  header.appendChild(heading);
  header.appendChild(subheading);
  const closeButtonHeader = new FakeElement({ classNames: ["bot-close"] });
  header.appendChild(closeButtonHeader);
  botWindow.appendChild(header);

  const body = new FakeElement({ classNames: ["bot-body"] });
  const summary = new FakeElement({ id: "bot-summary" });
  const stats = new FakeElement({ classNames: ["bot-stats"] });
  const average = new FakeElement({ id: "bot-average" });
  const count = new FakeElement({ id: "bot-count" });
  stats.appendChild(average);
  stats.appendChild(count);
  const reviews = new FakeElement({ id: "bot-reviews" });
  body.appendChild(summary);
  body.appendChild(stats);
  body.appendChild(reviews);
  botWindow.appendChild(body);

  const footer = new FakeElement({ classNames: ["bot-footer"] });
  const closeButtonFooter = new FakeElement({ classNames: ["bot-close"] });
  footer.appendChild(closeButtonFooter);
  botWindow.appendChild(footer);
  overlay.appendChild(botWindow);

  const cardsContainer = new FakeElement({ tagName: "main" });
  Object.keys(businesses).forEach((id) => {
    const card = new FakeElement({ classNames: ["business-card"], dataset: { businessId: id } });
    cardsContainer.appendChild(card);
  });

  doc.register(cardsContainer);
  doc.register(overlay);

  return {
    doc,
    overlay,
    heading,
    subheading,
    summary,
    average,
    count,
    reviews,
    botWindow,
    cards: cardsContainer.children,
  };
}

const {
  doc: testDoc,
  overlay: testOverlay,
  heading: testHeading,
  subheading: testSubheading,
  summary: testSummary,
  average: testAverage,
  count: testCount,
  reviews: testReviews,
  botWindow: testWindow,
  cards: testCards,
} = buildTestDocument();

testDoc.activeElement = testCards[0];

const { openBot, closeBot } = setupReviewBot(testDoc);

assert.equal(testOverlay.hidden, true, "overlay should start hidden");

openBot("bella-bistro");

assert.equal(testOverlay.hidden, false, "overlay should be visible after opening");
assert.equal(testOverlay.dataset.activeBusiness, "bella-bistro");
assert.equal(testHeading.textContent, "Bella Bistro reviews");
assert.equal(testSubheading.textContent, "Restaurant");
assert.equal(testSummary.textContent.includes("candle-lit ambiance"), true);
assert.equal(testAverage.textContent, "4.6 ★");
assert.equal(testCount.textContent, "128 verified reviews");
assert.equal(testReviews.children.length, 2, "should render two reviews");
assert.equal(testDoc.activeElement, testWindow, "focus should move to bot window");

closeBot();

assert.equal(testOverlay.hidden, true, "overlay should hide after closing");
assert.equal("activeBusiness" in testOverlay.dataset, false, "dataset should be cleared");
assert.equal(testDoc.activeElement, testCards[0], "focus should return to the original card");

console.log("All review bot tests passed");
