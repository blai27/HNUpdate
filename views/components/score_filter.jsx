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
      <div>
        <span>Minimum Score: </span>
        <input className="form-control select-handle" onChange={this.onValueChange} type="number" defaultValue={this.state.value} />
      </div>
    );
  }
});