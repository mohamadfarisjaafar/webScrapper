const cheerio = require('cheerio');
const rp = require('request-promise');
const fs = require('fs');
const MIN_IMAGE_SIZE = 1000;

async function scrapeImages(url, saveDir) {
  const html = await rp(url);
  const $ = cheerio.load(html);

  const imageUrls = $('img').map((i, img) => $(img).attr('src')).get();

  for (let i = 0; i < imageUrls.length; i++) {
    const imageUrl = imageUrls[i];
    const extension = imageUrl.split('.').pop();
    const filename = `image-${i}.${extension}`;
    const imageStream = await rp.get({url: imageUrl, encoding: null});
    if (imageStream.length > MIN_IMAGE_SIZE) {
      fs.writeFileSync(`${saveDir}/${filename}`, imageStream);
    }
  }

  return imageUrls;
}

// Example usage
const url = 'https://www.pinterest.com/ideas/';
const saveDir = './image';
scrapeImages(url, saveDir).then((imageUrls) => {
  console.log(imageUrls);
}).catch((err) => {
  console.error(err);
});
