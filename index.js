const libxmljs = require('libxmljs');
const fs = require('fs');
const opml = require('opml-generator');

fs.readFile('Firefox feeds backup.opml', 'utf-8', (err, data) => {
  const xmlDoc = libxmljs.parseXml(data);
  const head_title = xmlDoc.get('/opml/head/title').text();

  const header = {
    title: head_title,
  };

  const outlineType = xmlDoc.find('/opml/body/outline/@type');
  const outlineTitle = xmlDoc.find('/opml/body/outline/@title');
  const outlineText = xmlDoc.find('/opml/body/outline/@text');
  const outlineXmlUrl = xmlDoc.find('/opml/body/outline/@xmlUrl');
  const outlineHtmlUrl = xmlDoc.find('/opml/body/outline/@htmlUrl');

  const outlines = outlineType.map((object, i) => ({
    type: outlineType[i].value(),
    title: outlineTitle[i].value(),
    text: outlineText[i].value(),
    xmlUrl: outlineXmlUrl[i].value(),
    htmlUrl: outlineHtmlUrl[i].value(),
  }));

  const outlines_reverse = outlines.map((object, i) => {
    return outlines[outlines.length - i - 1];
  });

  const doc = opml(header, outlines_reverse);
  // console.log(doc.toString());

  fs.writeFile('Firefox feeds backup in reverse order.opml', doc, (err) => {
    if (err) throw err;
  });
});
