import _ from 'lodash';
import axios from 'axios';

const SERVER_URL = 'https://hacker-news.firebaseio.com/v0';
const PAGE_SIZE = 15;

export default {
  async list(page = 1) {
    const { data: idList } = await axios.get(`${SERVER_URL}/topstories.json`, {
      params: {
        orderBy: '"$key"',
        startAt: `"${PAGE_SIZE * (page - 1)}"`,
        endAt: `"${(PAGE_SIZE * page) - 1}"`,
      },
    });

    const urlList = _.map(idList, _.identity).map(elem => axios(`${SERVER_URL}/item/${elem}.json`));
    const newsList = await axios.all(urlList);
    return newsList.map(elem => elem.data);
  },
};
