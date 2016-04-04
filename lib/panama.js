addToClasspath("../jars/jsoup-1.8.3.jar");
importPackage(Packages.org.jsoup);

const strings = require("ringo/utils/strings");

const books = [
  "http://www.amazon.de/dp/3407799640",
  "http://www.amazon.de/dp/3407805330",
  "http://www.amazon.de/dp/340776006X"
];

const results = books.map(function(url) {
  const book = {
    "url": url
  };

  const doc = Jsoup.connect(url).get();
  book.title = doc.title();

  const salesRankNode = doc.getElementById("SalesRank");
  if (salesRankNode != null) {
    book.rankings = salesRankNode.select("li.zg_hrsr_item").toArray().map(function(ranking, index) {
      let rank = ranking.select(".zg_hrsr_rank").first().text().trim();

      if (strings.isInt(rank.replace("Nr. ", ""))) {
        rank = parseInt(rank.replace("Nr. ", ""), 10);
      }

      return {
        "rank": rank,
        "ladder": ranking.select(".zg_hrsr_ladder").first().text().trim()
      };
    });
  } else {
    console.error("No Sales Node!");
  }

  return book;
});

require("system").stdout.print(JSON.stringify(results, null, 2));
