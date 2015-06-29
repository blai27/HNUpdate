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
      <div className="form-horizontal">
        <div className="form-group">
          <span className="col-sm-4 control-label font-other">Post Type: </span>
          <div className="col-sm-6 col-sm-offset-2">
            <select className="select-handle form-control" onChange={this.selectChange} value={this.state.value}>
              <option value="all">All Posts</option>
              <option value="ask">Ask HNs</option>
              <option value="show">Show HNs</option>
              <option value="job">Jobs</option>
            </select>
          </div>
        </div>
      </div>
    );
  }
});