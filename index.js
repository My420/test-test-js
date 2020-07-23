const assert = require('assert');
const rp = require('request-promise');

const sum = (data) => Object.keys(data).reduce((acc, elem) => acc + data[elem], 0);

const findTopValue = (data) => Math.max(...Object.values(data));

const getTuesdaysData = (data) => Object.keys(data).reduce((acc, elem) => {
  if (new Date(elem).getDay() === 2) acc[elem] = data[elem];
  return acc;
}, {});

const getTopDates = (data, amount) => Object.keys(data)
  .sort((a, b) => data[a] > data[b] ? -1 : 1)
  .splice(0, amount)
  .reduce((acc, elem) => {
    acc[elem] = data[elem];
    return acc;
  }, {});


describe('object operations', () => {
  let data;

  before(async () => {
    const params = {
      uri: "https://api.coindesk.com/v1/bpi/historical/close.json?start=2019-01-01&end=2019-01-31",
      headers: {
        'User-Agent': 'Request-Promise'
      },
      json: true,
    };

    const result = await rp(params);
    data = result.bpi;
  });

  it('should pass if the data has been correctly populated', () => {
    const exists = data.hasOwnProperty('2019-01-01');
    assert.ok(exists);
  });

  it('should return the sum of all values', () => {
    const actual = sum(data); // TODO: #1
    const expected = 114390.02239999999;
    assert.equal(actual, expected);
  });

  it('should find the top value (Number) from any date', () => {
    const actual = findTopValue(data); // TODO: #2
    const expected = 4083.165;
    assert.equal(actual, expected);
  });

  it('should extract only the results from Tuesdays', () => {
    const actual = getTuesdaysData(data); // TODO: #3
    const expected = {
      '2019-01-01': 3869.47,
      '2019-01-08': 4029.9917,
      '2019-01-15': 3604.1333,
      '2019-01-22': 3598.2183,
      '2019-01-29': 3421.12
    };
    assert.deepEqual(actual, expected);
  });

  it('should return the top 5 dates in descending order', () => {
    const actual = getTopDates(data, 5); // TODO: #4
    const expected = {
      '2019-01-06': 4083.165,
      '2019-01-07': 4041.4583,
      '2019-01-08': 4029.9917,
      '2019-01-09': 4028.2917,
      '2019-01-02': 3941.2167
    };
    assert.deepEqual(actual, expected);
  });
});