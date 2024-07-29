import axios from 'axios'

export let importCountrys = () =>
  axios.get(`https://restcountries.com/v3.1/all?fields=name,flags`).then((res) => {
    return res.data
      .map((el) => {
        return {
          image: el.flags.png,
          name:
            el.name.common.length > 20 ? el.name.common.substring(0, 20) + '...' : el.name.common
        }
      })
      .filter((el) => el.name !== 'Israel' && el.name !== 'Western Sahara') //TODO: Filter the country didn't exists
      .sort((a, b) => {
        if (a.name < b.name) {
          return -1
        }
        if (a.name > b.name) {
          return 1
        }
        return 0
      })
  })
