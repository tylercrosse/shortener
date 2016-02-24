// Shortner > InputBox + (OutputList > ShortUrl)

var Shortener = React.createClass({
  render: function() {
     return (
       <div className="shortner">
         Hello, world! I am a div!
       </div>
     );
   }
});

var InputBox = React.createClass({
  render: function() {}
});

var OutputList = React.createClass({
  render: function() {}

});

var ShortUrl = React.createClass({
  render: function() {}

});

ReactDOM.render(
  <Shortener />,
  document.getElementById('content')
);
