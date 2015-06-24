var Options = React.createClass({
  getInitialState: function() {
    return {
      
    };
  },
  typeChange: function(value) {
    var state = this.state;
    state.type = value;
    this.setState(state);
  },
  scoreChange: function(value) {
    var state = this.state;
    state.score = value;
    this.setState(state);
  },
  render: function() {
    return (
      <div className="options-main">
        Options
        <TypeFilter callback={this.typeChange} />
        <ScoreFilter callback={this.scoreChange} />
      </div>
    );
  }
});

React.render(<Options />, document.getElementById('options'));