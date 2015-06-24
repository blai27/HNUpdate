var TypeFilter = React.createClass({
  getInitialState: function() {
    return {
      value: 'all'
    };
  },
  selectChange: function(event) {
    this.setState({value: event.target.value});
    this.props.callback(event.target.value);
  },
  render: function() {
    return (
      <div>
        <span>Post type: </span>
        <select className="select-handle form-control" onChange={this.selectChange} value={this.state.value}>
          <option value="all">All Posts</option>
          <option value="ask">Ask HNs</option>
          <option value="show">Show HNs</option>
          <option value="job">Jobs</option>
        </select>
      </div>
    );
  }
});