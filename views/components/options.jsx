var Options = React.createClass({
  getInitialState: function() {
    return {
      type : 'all',
      score : 0,
      order: 'desc',
      items: []
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
  orderChange: function(value) {
    var state = this.state;
    state.order = value;
    this.setState(state);
  },
  request: function(event) {
    this.loadItemsFromServer();
  },
  loadItemsFromServer: function() {
    var self = this;
    var state = this.state;
    $.ajax({
      url: '/hour',
      type: 'GET',
      dataType: 'json',
      timeout: 5000,
      success: function(data) {
        state.items = data;
        self.setState(state);
      },
      error: function(err) {
        console.log('Error occurred');
      }
    });
  },
  render: function() {
    return (
      <div className="options-main">
        <button className="btn btn-default" type="button" data-toggle="collapse" data-target="#optionsCollapse" aria-expanded="false" aria-controls="optionsCollapse">
          <i className="fa fa-cog"></i>
          &nbsp; 
          <span className="font-standard">
            Options
          </span>
        </button>
        <div className="collapse" id="optionsCollapse">
          <TypeFilter callback={this.typeChange} />
          <ScoreFilter callback={this.scoreChange} />
          <SortOrder callback={this.orderChange} />
        </div>
        <div>
          <button className="btn btn-default col-sm-offset-11" id="getMaxID" onClick={this.request}>Request</button>
        </div>
        <Results items={this.state.items} />
      </div>
    );
  }
});

React.render(<Options />, document.getElementById('options'));