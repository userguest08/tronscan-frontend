import React from "react";
import {tu} from "../../utils/i18n";
import {BarLoader} from "./loaders";
import AutosizeInput from "react-input-autosize";
import {connect} from "react-redux";
import {KEY_ENTER} from "../../utils/constants";

class Paging extends React.PureComponent {

  constructor() {
    super();
    this.state = {
      page: 1,
      pageValue: 1,
      pageSize:40,
      pageSizeOptions:[20,40,60,80]
    };

    this.pageInput = React.createRef();
  }

  changePage = (page) => {
    this.setState({ page: page });
    let {onChange} = this.props;
    let {pageSize}=this.state;
    onChange && onChange(page,pageSize);
  };

  changePageSize = (pageSize) => {
    this.setState({pageSize: pageSize}, () => {
      this.changePage(1);
    });
  };

  onKeyDown = (e) => {
    let {pageValue} = this.state;

    if (e.keyCode === KEY_ENTER) {
      this.changePage(pageValue);
    }
  };

  setPage = (page) => {
    let {total} = this.props;
    let {pageSize} = this.state;
    let totalPages = Math.ceil(total / pageSize);

    page = parseInt(page);

    if (isNaN(page))
      page = 1;

    if (page <= 0) {
      page = 1;
    } else if (page > totalPages) {
      page = totalPages;
    }

    this.setState({
      pageValue: page,
    });
  };

  renderButton(page) {
    let {url} = this.props;

    /*
    if (url) {
      return ({children}) => (
        <Link className="page-link" to={`${url}?page=${page}`}>
          {children}
        </Link>
      );
    } else {
    */
      return ({children}) => (
        <a className="page-link" href="javascript:" onClick={() => this.changePage(page)}>
          {children}
        </a>
      );
    /* }*/
  }

  render() {

    let {total, className, loading = false} = this.props;
    let {page, pageSize, pageSizeOptions, pageValue} = this.state;

    let totalPages = Math.ceil(total / pageSize);
    totalPages = totalPages <= 0 ? 1 : totalPages;

    let showFirst = page === 1;
    let showLast = !(totalPages > page);

    let FirstButton = this.renderButton(1);
    let PreviousButton = this.renderButton(page - 1);
    let NextButton = this.renderButton(page + 1);
    let LastButton = this.renderButton(totalPages);

    return (
      <div className="d-flex">
        <ul className={"pagination p-0 my-0 " + className} >
          <li className={"page-item " + (showFirst && "invisible")}>
            <FirstButton>
              <i className="fas fa-fast-backward mr-sm-2" />
              <span className="d-none d-sm-inline-block">{tu("first_page")}</span>
            </FirstButton>
          </li>
          <li className={"page-item " + (showFirst && "invisible")}>
            <PreviousButton>
              <i className="fas fa-backward mr-sm-2" />
              <span className="d-none d-sm-inline-block">{tu("previous_page")}</span>
            </PreviousButton>
          </li>
        </ul>
        <ul className="pagination p-0 my-0 mx-auto">
          <li className="mx-auto page-item" onClick={() => this.pageInput.current.focus()}>
            {
              loading ?
                <span className="page-link no-hover" style={{padding: 13 }}>
                  <BarLoader/>
                </span> :
                <span className="page-link">
                  {tu("page")}{' '}
                  <AutosizeInput
                    ref={this.pageInput}
                    className=""
                    inputClassName="border-0"
                    placeholder={page}
                    value={pageValue}
                    onBlur={() => this.changePage(pageValue)}
                    onFocus={ev => ev.target.select()}
                    onChange={e => this.setPage(e.target.value)}
                    onKeyDown={this.onKeyDown} />{' '}
                  {tu("of")}{' '}
                  {totalPages}
                </span>
            }
          </li>
        </ul>
        <ul className="pagination p-0 my-0 ">
          <li className={"page-item " + (showLast && " invisible")}>
            <NextButton>
              <span className="d-none d-sm-inline-block">{tu("next_page")}</span>
              <i className="fas fa-forward ml-sm-2" />
            </NextButton>
          </li>
          <li className={"page-item " + (showLast && " invisible")}>
            <LastButton>
              <span className="d-none d-sm-inline-block">{tu("last_page")}</span>
              <i className="fas fa-fast-forward ml-sm-2" />
            </LastButton>
          </li>
        </ul>
        <ul className="pagination p-0 my-0 ml-1">
          <li className="page-item">
            <a className="page-link" href="javascript:">
              <span className="d-none d-sm-inline-block">{tu("page_size")}:</span>
              <select className="ml-sm-1"
                      style={styles.pageSize}
                      onChange={(ev) => this.changePageSize(ev.target.value) }  value={pageSize}>
                 {
                   pageSizeOptions.map((size,index) => (
                     <option key={index} value={size}>{size}</option>
                   ))
                 }
              </select>
            </a>
          </li>
        </ul>
      </div>
    );
  }
}


const styles = {
  pageSize: {
    border: 0,
    backgroundColor: '#fff',
  }
};

function mapStateToProps(state) {
  return {
    activeLanguage: state.app.activeLanguage,
  };
}

const mapDispatchToProps = {

};

export default connect(mapStateToProps, mapDispatchToProps)(Paging);
