var Results = React.createClass({
  render: function() {
    var items = this.props.items;
    var mark_ups = [];
    for(var i = 0; i < items.length; i++) {
      mark_ups.push(<ResultItem title={items[i].by} />);
    }
    console.log(items.length);
    return (
      <div>
        {mark_ups}
      </div>
    );
  }
});