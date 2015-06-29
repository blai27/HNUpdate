var ScoreFilter = React.createClass({
  getInitialState: function() {
    return {
      value: 0
    };
  },
  onValueChange: function(event) {
    this.setState({value: event.target.value});
    this.props.callback(event.target.value);
  },
  render: function() {
    return (
      <div className="form-horizontal">
        <div className="form-group">
          <span className="col-sm-4 control-label font-other">Minimum Score: </span>
          <div className="col-sm-6 col-sm-offset-2">
            <input className="form-control select-handle" onChange={this.onValueChange} type="number" defaultValue={this.state.value} />
          </div>
        </div>
      </div>
    );
  }
});