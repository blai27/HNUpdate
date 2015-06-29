var SortOrder = React.createClass({
  getInitialState: function() {
    return {
      order: 'desc'
    };
  },
  ascend: function(event) {
    this.setState({order: 'asc'});
    this.props.callback('asc');
  },
  descend: function(event) {
    this.setState({order: 'desc'});
    this.props.callback('desc');
  },
  render: function (){
    var base = "btn btn-default";
    var classes_ascend = this.state.order === 'asc' ? base + " active" : base;
    var classes_descend = this.state.order === 'desc' ? base + " active" : base;
    return (
      <div className="form-horizontal">
        <div className="form-group">
          <span className="col-sm-4 control-label font-other">Sort Order: </span>
          <div className="col-sm-6 col-sm-offset-2">
            <div className="btn-group" role="group" aria-label="...">
              <button type="button" className={classes_ascend} onClick={this.ascend}>
                <i className="fa fa-sort-amount-asc"></i>
              </button>
              <button type="button" className={classes_descend} onClick={this.descend}>
                <i className="fa fa-sort-amount-desc"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
});