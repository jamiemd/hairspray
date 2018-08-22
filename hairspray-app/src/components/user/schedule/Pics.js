import React, { Component } from "react";

class Pics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pic1: "",
      pic2: "",
      pic3: ""
    };
  }

  handleChange = event => {
    const name = event.target.name;
    this.setState({
      [name]: event.target.value
    });

    this.props.cbFromParent(this.state);
  };

  render() {
    return (
      <div>
        <div>Add 3 URL links to photos of example hairstyles. (Optional)</div>
        <form>
          <label>
            Pic1:
            <input
              name="pic1"
              type="text"
              value={this.state.pic1}
              onChange={this.handleChange}
            />
          </label>
          <label>
            Pic2:
            <input
              name="pic2"
              type="text"
              value={this.state.pic2}
              onChange={this.handleChange}
            />
          </label>
          <label>
            Pic3:
            <input
              name="pic3"
              type="text"
              value={this.state.pic3}
              onChange={this.handleChange}
            />
          </label>
        </form>
        <div>
            <img src={} alt="pic1">Pic 1</img>


        </div>
      </div>
    );
  }
}

export default Pics;
