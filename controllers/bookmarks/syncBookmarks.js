const fs = require('fs');
const path = require('path');
const moment = require('moment');
const xmldom = require('xmldom');
// const BMParser = require('bookmark-parser');
// const Readable = require('stream').Readable;

const asyncWrapper = require('../../middleware/asyncWrapper');
const Bookmark = require('../../models/Bookmark');
const Category = require('../../models/Category');
const parseBookmarks = require('../../utils/bookmark_parser');

// @desc      Sync bookmarks
// @route     POST /api/syncBookmark
// @access    Public
const syncBookmark = asyncWrapper(async (req, res) => {
  const html = fs.readFileSync(path.join(__dirname, '../../', req.file.path), {
    encoding: 'utf8',
  });

  const parsedBookmarks = parseBookmarks(html, { DOMParser: xmldom.DOMParser });

  let total = 0;
  let promises = [];
  const deepCreate = async (data, folder, timestamp) => {
    let bookmarks = [];
    for (const item of data) {
      if (item.type === 'bookmark') {
        bookmarks.push(item);
      } else {
        await deepCreate(item.children, item.title, timestamp);
      }
    }

    if (bookmarks.length) {
      const category = await Category.create({
        isPublic: false,
        name: `${folder}-${timestamp}`,
        isPinned: false,
      });
      for (const bookmark of bookmarks) {
        total = total + 1;
        await Bookmark.create({
          categoryId: category.id,
          icon: bookmark.icon,
          isPublic: false,
          name: bookmark.title,
          url: bookmark.url,
        });
      }
    }
  };

  if (parsedBookmarks.length) {
    const timestamp = moment().format('hh:mm:ss');
    await deepCreate(parsedBookmarks, 'OtherBookmarks', timestamp);
    res.status(200).json({
      success: true,
      data: { total },
    });
  }
});

module.exports = syncBookmark;
