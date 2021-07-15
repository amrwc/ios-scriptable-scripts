const { FontMock, FontSizeType } = require('../../test-util/__mock/FontMock');
const { ListWidgetMock } = require('../../test-util/__mock/ListWidgetMock');

const { XkcdComic } = require('../../dto/XkcdComic');
const { XkcdWidgetService } = require('../XkcdWidgetService');

test('Should have created comic widget', () => {
	global.ListWidget = ListWidgetMock;
	global.Font = FontMock;

	const refreshAfterDate = 300;
	const image = jest.fn();
	const imageUrl = 'https://img.test.com/img1.jpg';
	const title = 'Comic Title';
	const comicNumber = 1234;
	const comic = new XkcdComic(image, imageUrl, title, comicNumber);

	const timeUtil = {
		getDateInNMinutes: jest.fn().mockReturnValueOnce(refreshAfterDate),
	};
	const service = new XkcdWidgetService(timeUtil);

	const result = service.createWidget(comic);

	expect(timeUtil.getDateInNMinutes).toHaveBeenCalledTimes(1);
	expect(result.refreshAfterDate).toBe(refreshAfterDate);
	expect(result.stacks).toHaveLength(2);
	expect(result.stacks[0].text.text).toBe(title);
	expect(result.stacks[0].text.font.sizeType).toBe(FontSizeType.HEADLINE);
	expect(result.stacks[1].image).toBe(image);
	expect(result.url).toBe('https://xkcd.com/' + comicNumber);

	delete global.ListWidget;
	delete global.Font;
});
