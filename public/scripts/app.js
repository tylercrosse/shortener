// Shortner > InputBox + (OutputList > OutputUrl)

var Shortener = React.createClass({
  loadUrlsFromServer: function() {
    $.ajax({
      url: '/api/url',
      dataType: 'json',
      cache: false,
      success: (data) => {
        this.setState({data: data});
      },
      error: (xhr, status, err) => {
        console.error('/api/url', status, err.toString());
      }
    });
  },
  handleUrlSubmit: function(url) {
    var urls = this.state.data;
    // TODO pull in params
    //set state to reflect new comments
    $.ajax({
      url: '/api/url/',
      dataType: 'json',
      type: 'POST',
      data: url,
      success: (data) => {
        this.setState({data: data});
      },
      error: (xhr, status, err) => {
        this.setState({data: comments});
        console.log(this.props.url, status, err.toString());
      }
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadUrlsFromServer();
    setInterval(this.loadUrlsFromServer, this.props.pollInterval);
  },
  render: function() {
     return (
       <div className="shortener">
         <h1>Hello, world! I am a shortener!</h1>
         <InputBox />
         <OutputList data={this.state.data}/>
       </div>
     );
   }
});

var InputBox = React.createClass({
  getInitialState: function() {
    return {orginalUrl: ''};
  },
  handleInputChange: function(e) {
    this.setState({originalUrl: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var orginalUrl = this.state.orginalUrl.trim();
    if (!originalUrl) {
      return
    }
    this.props.onInputSubmit({orginalUrl: orginalUrl});
    this.setState({originalUrl: ''});
  },
  render: function() {
    return (
      <form clasName="commentForm" onSubmit={this.handleSubmit}>
        <input
          type="text"
          placeholder="Put in your long link"
          onChange={this.handleAuthorChange}
        />
        <input type="submit" value="Shorten" />
      </form>
    )
  }
});

var OutputList = React.createClass({
  render: function() {
    var outputNodes = this.props.data.map(function(url) {
      return (
        <OutputUrl originalUrl={'SOMETHING SUPER DUPER LONGGGGGGGGGGGG'} shortUrl={'some short'}>
        </OutputUrl>
      )
    })

    return (
      <div className="outputList">
        {outputNodes}
      </div>
    )
  }

});

var OutputUrl = React.createClass({
  render: function() {
    return (
      <div className="outputUrl">
        <p clasName="orginalUrl">{this.props.orginalUrl}</p>
        <p clasName="shortUrl">{this.props.shortUrl}</p>
      </div>
    )
  }

});

ReactDOM.render(
  <Shortener pollInterval={2000} />,
  document.getElementById('content')
);
