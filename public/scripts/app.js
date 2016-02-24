// Shortner > InputBox + (OutputList > OutputUrl)

var Shortener = React.createClass({
  loadUrlsFromServer: function() {
    $.ajax({
      url: '/api/links',
      dataType: 'json',
      cache: false,
      success: (data) => {
        console.log(data);
        this.setState({data: data});
      },
      error: (xhr, status, err) => {
        console.error('/api/links', status, err.toString());
      }
    });
  },
  handleUrlSubmit: function(url) {
    $.ajax({
      url: '/api/links',
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
         <InputBox onInputSubmit={this.handleUrlSubmit} />
         <OutputList data={this.state.data}/>
       </div>
     );
   }
});

var InputBox = React.createClass({
  getInitialState: function() {
    return {originalUrl: ''};
  },
  handleInputChange: function(e) {
    this.setState({originalUrl: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var originalUrl = this.state.originalUrl.trim();
    if (!originalUrl) {
      return
    }
    this.props.onInputSubmit({originalUrl: originalUrl});
    this.setState({originalUrl: ''});
  },
  render: function() {
    return (
      <form className="inputForm" onSubmit={this.handleSubmit}>
        <input
          type="text"
          placeholder="Put in long link"
          value={this.state.originalUrl}
          onChange={this.handleInputChange}
        />
        <input className="submitBtn" type="submit" value="Shorten" />
      </form>
    )
  }
});

var OutputList = React.createClass({
  render: function() {
    var outputNodes = this.props.data.map(function(url) {
      return (
        <OutputUrl key={url._id} originalUrl={url.originalUrl} shortUrl={url.shortUrl} visitCount={url.visitCount} createdAt={url.createdAt}>
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
        <p clasName="originalUrl">{this.props.originalUrl}</p>
        <a clasName="shortUrl" href={this.props.shortUrl} target="_blank">127.0.0.1:3000/{this.props.shortUrl}</a>
        <p className="visitCount">Visits: {this.props.visitCount}</p>
        <p className="createdAt">Created at: {this.props.createdAt}</p>
      </div>
    )
  }
});

ReactDOM.render(
  <Shortener pollInterval={2000} />,
  document.getElementById('content')
);
