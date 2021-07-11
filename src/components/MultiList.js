import React from 'react'
import Twitter from 'twitter'

class MultiList extends React.Component {
  constructor(props) {
    super(props)
    this.getTweet = this.getTweet.bind(this)
    this.state = {
      multiList: [],
    }
  }

  getTweet() {
    let client = new Twitter({
      consumer_key: process.env.REACT_APP_CONSUMER_KEY,
      consumer_secret: process.env.REACT_APP_CONSUMER_SECRET,
      access_token_key: process.env.REACT_APP_ACCESS_TOKEN_KEY,
      access_token_secret: process.env.REACT_APP_ACCESS_TOKEN_SECRET,
    })

    //ツイート取得
    let self = this
    client.stream('statuses/filter', { track: ':参戦ID' }, function (stream) {
      stream.on('data', function (tweet) {
        let splittedTweet = tweet.text.split(/[ \n]/)
        let i = 0
        splittedTweet.forEach(function (value, index) {
          if (value == ':参戦ID') {
            i = index
          }
        })

        //データ加工
        let multiInfos = {
          multiInfo: splittedTweet[i + 2] + ' ' + splittedTweet[i + 3] + ' ' + splittedTweet[i - 1],
        }
        console.log('multiInfos : ', multiInfos.multiInfo)

        const multiList_copy = self.state.multiList.slice()
        multiList_copy.push(multiInfos)
        this.setState({ multiList: multiList_copy })
        // if (self.multiList.length > 10) {
        //   self.multiList.shift()
        // }
      })

      stream.on('error', function (error) {
        console.log(error)
      })
    })
  }

  render() {
    const multiList = this.state.multiList.map((multiList, index) => (
      // Only do this if items have no stable IDs
      <li key={index}>{multiList}</li>
    ))
    return (
      <div>
        <button onClick={this.getTweet}>ツイート取得</button>
        <ul>{multiList}</ul>
      </div>
    )
  }
}

export default MultiList
