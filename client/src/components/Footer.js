import React from 'react';
import { withRouter } from 'react-router-dom';
class Footer extends React.Component {
  redirectToOther = () => {
    window.location.href = 'https://psucompbio.org/';
  };

  addFooterClass = () => {
    if (this.props.location.pathname === '/Contact') {
      return 'contact__page';
    } else if (this.props.location.pathname === '/About') {
      return 'about__page';
    }
    else if (this.props.location.pathname === '/Profile') {
      return 'profile__page';
    }
    else if (this.props.location.pathname === '/OrganizationAdmin') {
      return 'organization_team';
    }
    else if (this.props.location.pathname === '/profile') {
      return 'profile__page'
    }
  };

  render() {
    return (
      <div className={`footer ${this.addFooterClass()}`}>
        <div style={{ background: '' }} className="container">
          <div className="row pt-4">
            <div className="col-sm-6 col-md-6 col-lg-6">
              <img className="logo" src="/img/icon/logo.png" alt="" />
            </div>
            <div className="col-sm-6  col-md-6 col-lg-6">
              <button type="button" className="btn btn-primary float-right">
                Get Updates
              </button>
            </div>
            <hr />
          </div>
          <div className="row">
            <div className="col-sm-9 col-md-6 col-lg-6">
              <p>
                Contact Us: info@NSFCAREER.IO <br />
                IP | Privacy Policy &amp; IRB | Collaborate
              </p>
            </div>
            <div className="col-sm-3 col-md-6 col-lg-6">
              {/* <div className="icon-container">
            <a href="">
              <img className="px-2" src="/img/FooterImg/facebook-logo.svg" alt="" />
            </a>
            <a href="">
              <img className="px-2" src="/img/FooterImg/twitter-logo-silhouette.svg" alt="" />
            </a>
            <a href="">
              <img className="px-2" src="/img/FooterImg/icon.svg" alt="" />
            </a>
          </div> */}
            </div>
          </div>
          <div className="row text-center">
            <div className="col-md-12 col-lg-12">
            <p>
                    Contact Us: info@NSFCAREER.IO <br />
                    <span onClick={()=>window.open('')}>  IP </span> | Privacy Policy &amp; <span onClick={()=>window.open('')}>  IRB </span> | Collaborate
                  </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default withRouter(Footer);
