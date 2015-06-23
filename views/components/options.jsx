var Options = React.createClass({
  getInitialState: function() {
    return {
      value: 'ask'
    };
  },
  selectChange: function(event) {
    this.setState({value: event.target.value});
  },
  render: function() {
    return (
      <div className="options-main">
        Options
        <div>
          <span>Post type: </span>
          <select className="select-handle form-control" onChange={this.selectChange} value={this.state.value}>
            <option value="all">All Posts</option>
            <option value="ask">Ask HNs</option>
            <option value="show">Show HNs</option>
            <option value="job">Jobs</option>
          </select>
        </div>
      </div>
    );
  }
});

React.render(<Options />, document.getElementById('options'));