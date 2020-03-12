/* eslint-disable no-undef */
import React, { Fragment } from "react";
import { injectIntl } from "react-intl";
import { NavLink, Route, Switch } from "react-router-dom";
import { Client } from "../../../services/api";
import { tu } from "../../../utils/i18n";
import { FormattedNumber } from "react-intl";
import TokenBalances from "./TokenBalances";
import MyContracts from "./Contracts";
import { ONE_TRX } from "../../../constants";
import { AddressLink, ExternalLink, HrefLink } from "../../common/Links";
import { TRXPrice } from "../../common/Price";
import { TronLoader } from "../../common/loaders";
import Transactions from "../../common/AddressTransactions";
import NewTransactions from "../../common/NewTransactions";
import Votes from "../../common/Votes";
import TransfersAll from "../../common/TransfersAll";
import xhr from "axios/index";
import _ from "lodash";
import Blocks from "../../common/Blocks";
import rebuildList from "../../../utils/rebuildList";
import rebuildToken20List from "../../../utils/rebuildToken20List";
import { API_URL } from "../../../constants.js";
import {
  FormatNumberByDecimals,
  FormatNumberByDecimalsBalance,
  toThousands
} from "../../../utils/number";
import { Tooltip, Icon } from "antd";
import BigNumber from "bignumber.js";
import { QuestionMark } from "../../common/QuestionMark";
import { CsvExport } from "../../common/CsvExport";
import moment from "moment";
import ApiClientAddress from "../../../services/addressApi";
import { alpha } from "../../../utils/str";
import Resource from "./Resource";
import Representative from "./Representative";
import { Piechart } from "../components/Piechart";
import SweetAlert from "react-bootstrap-sweetalert";

BigNumber.config({ EXPONENTIAL_AT: [-1e9, 1e9] });

class Address extends React.Component {
  constructor({ match }) {
    super();

    this.state = {
      totalPower: 0,
      candidates: [],
      showQrCode: false,
      loading: true,
      blocksProduced: 0,
      votes: null,
      rank: 0,
      totalVotes: 0,
      hasPage: false,
      address: {
        address: "",
        balance: 0,
        tokenBalances: {}
      },
      stats: {
        transactions: 0
      },
      csvurl: "",
      media: null,
      tabs: {
        transfers: {
          id: "transfers",
          icon: "fa fa-exchange-alt",
          path: "",
          label: <span>{tu("transfers")}</span>,
          cmp: () => <TronLoader>{tu("loading_transfers")}</TronLoader>
        },
        transactions: {
          id: "transactions",
          icon: "fas fa-handshake",
          path: "/transactions",
          label: <span>{tu("transactions")}</span>,
          cmp: () => <TronLoader>{tu("loading_transactions")}</TronLoader>
        }
      },
      walletReward: 0,
      sentDelegateBandwidth: 0,
      frozenBandwidth: 0,
      sentDelegateResource: 0,
      frozenEnergy: 0,
      TRXBalance: 0,
      realTimeVotes: 0,
      realTimeRanking: 0,
      lastRanking: 0,
      lastCycleVotes: 0,
      changeVotes: 0,
      changeRank: 0,
      sortTokenBalances: [],
      popup:null,
      brokerage:0,
      producedEfficiency:0
    };
  }

  componentDidMount() {
    let { match } = this.props;
    this.loadAddress(match.params.id);
    this.loadWitness(match.params.id);
    this.loadWalletReward(match.params.id);
  }

  componentDidUpdate(prevProps) {
    let { match } = this.props;

    if (match.params.id !== prevProps.match.params.id) {
      this.loadAddress(match.params.id);
      this.loadWitness(match.params.id);
      this.loadWalletReward(match.params.id);
    }
  }

  componentWillUnmount() {
    // this.live && this.live.close();
  }

  async loadWalletReward(addressT) {
    let { address } = this.state;
    let walletReward = await ApiClientAddress.getWalletReward(addressT);
    let reward = walletReward.reward || 0;
    this.setState({
      walletReward: reward
    });
  }

  async loadVotes(address) {
    let votes = await xhr.get(
      "https://api.tronscan.org/api/vote?sort=-votes&limit=40&start=0&candidate=" +
        address
    );

    let data = votes.data.data.slice(0, 10);
    let totalVotes = votes.data.totalVotes;
    for (let vote of data) {
      vote.name = vote.voterAddress;
      vote.value = ((vote.votes / totalVotes) * 100).toFixed(3);
    }
    this.setState({ votes: data });
  }

  async loadMedia(address) {
    return;
    try {
      let media = await Client.getAddressMedia(address);
      if (media.success) {
        this.setState({
          media: {
            image: media.image
          }
        });
      }
    } catch (e) {}
  }

  async refreshAddress(id) {
    let { intl } = this.props;
    let address = await Client.getAddress(id);

    if (address.representative.enabled) {
      this.loadMedia(id);
    }

    this.setState(prevProps => ({
      address,
      tabs: {
        ...prevProps.tabs,
        token_balances: {
          id: "token_balances",
          icon: "fa fa-piggy-bank",
          // path: "/token-balances",
          path: "",
          label: <span>{tu("token_balances")}</span>,
          cmp: () => (
            <TokenBalances tokenBalances={address.balances} intl={intl} />
          )
        }
      }
    }));
  }

  async loadAddress(id) {
    let { intl } = this.props;
    this.setState({ loading: true, address: { address: id }, media: null });

    let address = await Client.getAddress(id);
    if (address.representative.enabled) {
      this.loadMedia(id);
    }

    let balances = rebuildList(address.balances, "name", "balance");
    let x;
    balances.map((item, index) => {
      if (item.map_token_id === "_") {
        item.map_amount_logo =
          "https://s2.coinmarketcap.com/static/img/coins/64x64/1958.png";
        item.tokenType = "-";
        item.priceInTrx = 1;
      } else {
        item.tokenType = "TRC10";
      }

      if (item.priceInTrx) {
        x = new BigNumber(item.map_amount);
        item.TRXBalance = x.multipliedBy(item.priceInTrx).decimalPlaces(6);
        item.TRXBalance_toThousands = toThousands(
          x.multipliedBy(item.priceInTrx).decimalPlaces(6)
        );
      } else {
        item.TRXBalance = 0;
      }
    });

    let trc20token_balances_new = rebuildToken20List(
      address.trc20token_balances,
      "contract_address",
      "balance"
    );
    let y;
    trc20token_balances_new &&
      trc20token_balances_new.map(item => {
        item.tokenType = "TRC20";
        item.token20_name = item.name + "(" + item.symbol + ")";
        item.token20_balance = FormatNumberByDecimals(
          item.balance,
          item.decimals
        );
        item.token20_balance_decimals = FormatNumberByDecimalsBalance(
          item.balance,
          item.decimals
        );
        item.map_amount = FormatNumberByDecimalsBalance(
          item.balance,
          item.decimals
        );
        if (item.priceInTrx) {
          y = new BigNumber(item.token20_balance_decimals);
          item.TRXBalance = y.multipliedBy(item.priceInTrx).decimalPlaces(6);
          item.TRXBalance_toThousands = toThousands(
            y.multipliedBy(item.priceInTrx).decimalPlaces(6)
          );
        } else {
          item.TRXBalance = 0;
        }

        return item;
      });

    let tokenBalances = balances.concat(trc20token_balances_new);

    let sortTokenBalances = _(tokenBalances)
      .sortBy(tb => -tb.TRXBalance)
      .value();
    this.setState({
      sortTokenBalances: sortTokenBalances
    });

    let TRXBalance = 0;
    tokenBalances.map((item, index) => {
      TRXBalance += Number(item.TRXBalance);
    });

    let stats = await Client.getAddressStats(id);

    let { rangeTotal: totalProducedBlocks } = await Client.getBlocks({
      producer: id,
      limit: 1,
      start_timestamp: moment([2018, 5, 24])
        .startOf("day")
        .valueOf()
    });
    if (address.representative.enabled) {
      this.setState(prevProps => ({
        loading: false,
        address,
        blocksProduced: totalProducedBlocks,
        stats,
        tabs: {
          // ...prevProps.tabs,
          token_balances: {
            id: "token_balances",
            // icon: "fa fa-piggy-bank",
            // path: "/token-balances",
            path: "",
            label: <span>{tu("token_balances")}</span>,
            cmp: () => (
              <TokenBalances tokenBalances={tokenBalances} intl={intl} />
            )
          },
          transfers: {
            id: "transfers",
            // icon: "fa fa-exchange-alt",
            path: "/transfers",
            label: <span>{tu("transfers")}</span>,
            cmp: () => (
              <TransfersAll
                id={{ address: id }}
                getCsvUrl={csvurl => this.setState({ csvurl })}
                address
              />
            )
          },
          // transfers20: {
          //   id: "transfers20",
          //   // icon: "fa fa-exchange-alt",
          //   path: "/20transfers",
          //   label: <span>{tu("20_transfers")}</span>,
          //   cmp: () => <TransfersTrc20 filter={{address: id}}/>
          // },
          transactions: {
            id: "transactions",
            // icon: "fas fa-handshake",
            path: "/transactions",
            label: <span>{tu("transactions")}</span>,
            cmp: () => (
              <NewTransactions
                getCsvUrl={csvurl => this.setState({ csvurl })}
                filter={{ address: id }}
                address
              />
            )
          },
          intransactions: {
            id: "intransactions",
            // icon: "fas fa-handshake",
            path: "/internal-transactions",
            label: <span>{tu("internal_transactions")}</span>,
            cmp: () => (
              <Transactions
                getCsvUrl={csvurl => this.setState({ csvurl })}
                filter={{ address: id }}
                isinternal
              />
            )
          },

          blocks_produced: {
            id: "blocks-produced",
            // icon: "fa fa-cube",
            path: "/blocks",
            label: <span>{tu("account_block")}</span>,
            cmp: () => (
              <Blocks
                filter={{ producer: id }}
                intl={intl}
                getCsvUrl={csvurl => this.setState({ csvurl })}
                blockReward={this.state.blockReward}
              />
            )
          },
          votes: {
            id: "votes",
            // icon: "fa fa-bullhorn",
            path: "/votes",
            label: <span>{tu("votes")}</span>,
            cmp: () => (
              <Votes
                filter={{ voter: id }}
                showVoter={false}
                showVoterPercentage={false}
              />
            )
          },
          voters: {
            id: "voters",
            // icon: "fa fa-bullhorn",
            path: "/voters",
            label: <span>{tu("voters")}</span>,
            cmp: () => (
              <Votes
                filter={{ candidate: id }}
                showCandidate={false}
                getCsvUrl={csvurl => this.setState({ csvurl })}
              />
            )
          },
          contracts: {
            id: "contracts",
            path: "/contracts",
            label: <span>{tu("account_details_contracts")}</span>,
            cmp: () => (
              <MyContracts filter={{ address: id }} showCandidate={false} />
            )
          }
        }
      }));
    } else {
      this.setState(prevProps => ({
        loading: false,
        address,
        blocksProduced: totalProducedBlocks,
        stats,
        tabs: {
          // ...prevProps.tabs,
          token_balances: {
            id: "token_balances",
            // icon: "fa fa-piggy-bank",
            // path: "/token-balances",API_URL=http://3.14.14.175:9000 yarn build
            path: "",
            label: <span>{tu("token_balances")}</span>,
            cmp: () => (
              <TokenBalances tokenBalances={tokenBalances} intl={intl} />
            )
          },
          transfers: {
            id: "transfers",
            // icon: "fa fa-exchange-alt",
            path: "/transfers",
            label: <span>{tu("transfers")}</span>,
            cmp: () => (
              <TransfersAll
                getCsvUrl={csvurl => this.setState({ csvurl })}
                id={{ address: id }}
                address
              />
            )
          },
          // transfers20: {
          //   id: "transfers20",
          //   // icon: "fa fa-exchange-alt",
          //   path: "/20transfers",
          //   label: <span>{tu("20_transfers")}</span>,
          //   cmp: () => <TransfersTrc20 filter={{address: id}}/>
          // },
          transactions: {
            id: "transactions",
            // icon: "fas fa-handshake",
            path: "/transactions",
            label: <span>{tu("transactions")}</span>,
            isHidden: true,
            cmp: () => (
              <NewTransactions
                getCsvUrl={csvurl => this.setState({ csvurl })}
                filter={{ address: id }}
                address
              />
            )
          },
          intransactions: {
            id: "intransactions",
            // icon: "fas fa-handshake",
            path: "/internal-transactions",
            label: <span>{tu("internal_transactions")}</span>,
            cmp: () => (
              <Transactions
                getCsvUrl={csvurl => this.setState({ csvurl })}
                filter={{ address: id }}
                isinternal
                address
              />
            )
          },
          votes: {
            id: "votes",
            // icon: "fa fa-bullhorn",
            path: "/votes",
            label: <span>{tu("votes")}</span>,
            cmp: () => (
              <Votes
                filter={{ voter: id }}
                showVoter={false}
                showVoterPercentage={false}
              />
            )
          },
          contracts: {
            id: "contracts",
            path: "/contracts",
            label: <span>{tu("account_details_contracts")}</span>,
            cmp: () => (
              <MyContracts filter={{ address: id }} showCandidate={false} />
            )
          }
        }
      }));
    }

    let sentDelegateBandwidth = 0;
    if (address.delegated && address.delegated.sentDelegatedBandwidth) {
      for (
        let i = 0;
        i < address.delegated.sentDelegatedBandwidth.length;
        i++
      ) {
        sentDelegateBandwidth =
          sentDelegateBandwidth +
          address.delegated.sentDelegatedBandwidth[i][
            "frozen_balance_for_bandwidth"
          ];
      }
    }

    let frozenBandwidth = 0;
    if (address.frozen.balances.length > 0) {
      frozenBandwidth = address.frozen.balances[0].amount;
    }

    let sentDelegateResource = 0;
    if (address.delegated && address.delegated.sentDelegatedResource) {
      for (let i = 0; i < address.delegated.sentDelegatedResource.length; i++) {
        sentDelegateResource =
          sentDelegateResource +
          address.delegated.sentDelegatedResource[i][
            "frozen_balance_for_energy"
          ];
      }
    }

    let frozenEnergy = 0;
    if (address.accountResource.frozen_balance_for_energy.frozen_balance > 0) {
      frozenEnergy =
        address.accountResource.frozen_balance_for_energy.frozen_balance;
    }

    let totalPower =
      sentDelegateBandwidth +
      frozenBandwidth +
      sentDelegateResource +
      frozenEnergy;

    this.setState({
      totalPower: totalPower,
      TRXBalanceTotal: TRXBalance + totalPower / ONE_TRX,
      netUsed: address.bandwidth.netUsed + address.bandwidth.freeNetUsed,
      netLimit: address.bandwidth.netLimit + address.bandwidth.freeNetLimit,
      netRemaining:
        address.bandwidth.netRemaining + address.bandwidth.freeNetRemaining,
      bandWidthPercentage:
        ((address.bandwidth.netUsed + address.bandwidth.freeNetUsed) /
          (address.bandwidth.netLimit + address.bandwidth.freeNetLimit)) *
        100,
      availableBandWidthPercentage:
        (1 -
          (address.bandwidth.netUsed + address.bandwidth.freeNetUsed) /
            (address.bandwidth.netLimit + address.bandwidth.freeNetLimit)) *
        100,
      energyUsed: address.bandwidth.energyUsed,
      energyLimit: address.bandwidth.energyLimit,
      energyRemaining:
        address.bandwidth.energyRemaining >= 0
          ? address.bandwidth.energyRemaining
          : 0,
      energyPercentage: address.bandwidth.energyPercentage * 100,
      availableEnergyPercentage:
        address.bandwidth.energyRemaining > 0
          ? (1 - address.bandwidth.energyPercentage) * 100
          : 0,
      sentDelegateBandwidth,
      frozenBandwidth,
      sentDelegateResource,
      frozenEnergy,
      TRXBalance,
      balance: address.balance
    });
  }

  async loadWitness(id) {
    /* 需要总票数，实时排名俩个参数*/
    let { data } = await Client.getVoteWitness(id);
    this.setState({
      totalVotes: data.realTimeVotes,
      rank: data.realTimeRanking,
      hasPage: data.hasPage,
      realTimeVotes: data.realTimeVotes,
      realTimeRanking: data.realTimeRanking,
      lastRanking: data.lastRanking,
      lastCycleVotes: data.lastCycleVotes,
      changeVotes: data.changeVotes,
      changeRank: data.realTimeRanking - data.lastRanking,
      brokerage:data.brokerage || 0,
      producedEfficiency:data.producedEfficiency || 0,
      blockReward:data.blockReward || 0,
    });
  }

  renderFrozenTokens() {
    let {
      totalPower,
      sentDelegateBandwidth,
      frozenBandwidth,
      sentDelegateResource,
      frozenEnergy,
      balance
    } = this.state;

    let GetEnergy = frozenEnergy + sentDelegateResource;
    let GetBandWidth = frozenBandwidth + sentDelegateBandwidth;
    let Owner = frozenBandwidth + frozenEnergy;
    let Other = sentDelegateResource + sentDelegateBandwidth;
    let totalType1 = GetEnergy + GetBandWidth;
    let totalType2 = Owner + Other;
    let GetEnergyPer =
      totalType1 != 0 ? ((GetEnergy / totalType1) * 100).toFixed(2) : "-";
    let GetBandWidthPer =
      totalType1 != 0 ? (100 - GetEnergyPer).toFixed(2) : "-";
    let OwnerPer =
      totalType2 != 0 ? ((Owner / totalType2) * 100).toFixed(2) : "-";
    let OtherPer = totalType2 != 0 ? (100 - OwnerPer).toFixed(2) : "-";

    const TooltipText = (
      <div style={{ lineHeight: "25px" }}>
        <div style={{ borderBottom: "1px solid #eee", paddingBottom: "5px" }}>
          {tu("address_get_energe")}：
          <FormattedNumber value={GetEnergy / ONE_TRX} />
          &nbsp;TRX ({GetEnergyPer}%)
          <br />
          {tu("address_get_bandwith")}：
          <FormattedNumber value={GetBandWidth / ONE_TRX} />
          &nbsp;TRX ({GetBandWidthPer}%)
        </div>
        <div style={{ paddingTop: "5px" }}>
          {tu("address_freeze_owner")}：
          <FormattedNumber value={Owner / ONE_TRX} />
          &nbsp;TRX ({OwnerPer}%)
          <br />
          {tu("address_freeze_other")}：
          <FormattedNumber value={Other / ONE_TRX} />
          &nbsp;TRX ({OtherPer}%)
        </div>
      </div>
    );
    return (
      <div>
        <span className="ml-1">(</span>
        {tu("address_tron_power_remaining")}:{" "}
        <FormattedNumber value={balance / ONE_TRX} />
        &nbsp;TRX &nbsp;
        {tu("freeze")}:{" "}
        <Tooltip placement="top" innerClassName="w-100" title={TooltipText}>
          <span style={{ color: "rgb(255, 163, 11)" }}>
            <FormattedNumber value={totalPower / ONE_TRX} />
            &nbsp;TRX&nbsp;
          </span>
        </Tooltip>
        <span>)</span>
      </div>
    );
  }
  pieChart() {
    let { intl } = this.props;
    let chartHeight = "300px";
    let { sortTokenBalances } = this.state;
    let data = [];
    sortTokenBalances.map(item => {
      let balance = Number(item.TRXBalance);
      if (balance > 0) {
        let name = item.symbol ? item.symbol : item.map_token_name_abbr;
        data.push({ name: name, value: balance });
      }
    });

    this.setState({
      popup: (
        <SweetAlert
          showConfirm={false}
          showClose={true}
          onConfirm={this.hideModal}
        >
          <Icon
            type="close"
            onClick={this.hideModal.bind(this)}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              fontSize: "14px",
              color: "#666666"
            }}
          />
          <Piechart
            style={{ height: chartHeight }}
            data={data}
            message={{ id: "account_piechart_title" }}
            intl={intl}
          />
        </SweetAlert>
      )
    });
  }
  hideModal = () => {
    this.setState({ popup: null });
  };
  scrollToAnchor = () => {
    window.scrollTo(0, 800);
  };
  render() {
    let {
      totalPower,
      address,
      tabs,
      stats,
      loading,
      blocksProduced,
      media,
      candidates,
      rank,
      totalVotes,
      netRemaining,
      bandWidthPercentage,
      energyRemaining,
      energyPercentage,
      TRXBalanceTotal,
      availableBandWidthPercentage,
      availableEnergyPercentage,
      csvurl,
      walletReward,
      balance,
      netLimit,
      energyLimit,
      realTimeVotes,
      realTimeRanking,
      lastRanking,
      lastCycleVotes,
      changeVotes,
      changeRank,
      popup
    } = this.state;
    let { match, intl } = this.props;
    let addr = match.params.id;

    if (!address) {
      return null;
    }

    let uploadURL =
      API_URL + "/api/v2/node/info_upload?address=" + match.params.id;
    let pathname = this.props.location.pathname;
    let tabName = "";
    let rex = /[a-zA-Z0-9]{34}\/?([a-zA-Z\\-]+)$/;
    pathname.replace(rex, function(a, b) {
      tabName = b;
    });
    return (
      <main className="container header-overlap account-new address-container">
        {popup}
        <div className="row">
          <div className="col-md-12 ">
            {loading ? (
              <div className="card">
                <TronLoader>
                  {tu("loading_address")} {address.address}
                </TronLoader>
              </div>
            ) : (
              <Fragment>
                <div className="card list-style-header">
                  {/* {address.representative.enabled && (
                    <div className="card-body">
                      <h5 className="card-title m-0">
                        <i className="fa fa-cube mr-2" />
                        {tu("representatives")}
                      </h5>
                    </div>
                  )} */}
                  <div className="address-title">
                    <AddressLink
                      address={address.address}
                      isContract={true}
                      includeCopy={true}
                      includeTransfer={true}
                      includeErcode={true}
                    />
                    <div>
                      {address.addressTag && (
                        <span className="addressTag">{address.addressTag}</span>
                      )}
                    </div>
                  </div>
                  <div className="row info-wrap">
                    <div className="col-md-7 address-info">
                      {address.representative.enabled ? (
                        <Representative data={this.state} url={match.url} />
                      ) : (
                        <table className="table m-0">
                          <tbody>
                            <tr>
                              <th>{tu("name")}:</th>
                              <td>
                                <span>{address.name ? address.name : "-"}</span>
                              </td>
                            </tr>
                            <tr>
                              <th>
                                <span className="mr-1">
                                  {tu("total_balance")}
                                </span>
                                <QuestionMark
                                  placement="top"
                                  text="address_total_balance_tip"
                                  className="ml-1"
                                />
                                <span className="ml-1">:</span>
                              </th>
                              <td>
                                <ul className="list-unstyled m-0 ">
                                  <li className="d-flex just-con mobile-no-flex flex-wrap">
                                    <div>
                                      <NavLink exact to={match.url}>
                                        <span
                                          className="colorYellow"
                                          onClick={this.scrollToAnchor.bind(
                                            this
                                          )}
                                        >
                                          <TRXPrice amount={TRXBalanceTotal} />{" "}
                                        </span>
                                      </NavLink>

                                      <span className="small">
                                        (
                                        <TRXPrice
                                          amount={TRXBalanceTotal}
                                          currency="USD"
                                          showPopup={false}
                                        />
                                        )
                                      </span>
                                      <img
                                        src={require("../../../images/address/chart.png")}
                                        onClick={this.pieChart.bind(this)}
                                        style={{ width: "17px", cursor: "pointer" }}
                                        className="ml-2"
                                      />
                                    </div>

                                    <div>
                                      <span className="small">
                                        {tu(
                                          "address_total_balance_info_sources"
                                        )}
                                        ：
                                      </span>
                                      <span className="small href-link">
                                        <HrefLink
                                          href={
                                            intl.locale == "zh"
                                              ? "https://poloniex.org/zh/"
                                              : "https://poloniex.org/"
                                          }
                                        >
                                          POLONIDEX
                                        </HrefLink>
                                      </span>
                                    </div>
                                  </li>
                                </ul>
                              </td>
                            </tr>
                            <tr>
                              <th>
                                <span className="mr-1">
                                  {tu("address_balance")}
                                </span>
                                <span className="ml-1">:</span>
                              </th>
                              <td>
                                <ul className="list-unstyled m-0">
                                  <li className="d-flex flex-wrap">
                                    <span>
                                      <FormattedNumber
                                        value={(balance + totalPower) / ONE_TRX}
                                      />{" "}
                                      TRX
                                    </span>
                                    <div>{this.renderFrozenTokens()}</div>
                                  </li>
                                </ul>
                              </td>
                            </tr>
                            <tr>
                              <th>
                                <span className="mr-1">
                                  {tu("address_vote_reward_pending")}
                                </span>
                                <span className="ml-1">:</span>
                              </th>
                              <td>
                                <ul className="list-unstyled m-0">
                                  <li className="d-flex">
                                    <TRXPrice
                                      amount={walletReward / ONE_TRX}
                                      showPopup={false}
                                    />
                                  </li>
                                </ul>
                              </td>
                            </tr>
                            <tr>
                              <th>
                                <span className="mr-1">
                                  {tu("address_info_transactions")}
                                </span>
                                <QuestionMark
                                  placement="top"
                                  text="address_transactions_tip"
                                />
                                <span className="ml-1">:</span>
                              </th>
                              <td>
                                <NavLink exact to={match.url + "/transactions"}>
                                  <span
                                    className="colorYellow"
                                    onClick={this.scrollToAnchor.bind(this)}
                                  >
                                    {address.totalTransactionCount} &nbsp;
                                  </span>
                                </NavLink>
                                Txns
                              </td>
                            </tr>
                            <tr>
                              <th>
                                <span className="mr-1">
                                  {tu("address_info_transfers")}
                                </span>
                                <QuestionMark
                                  placement="top"
                                  text="account_representative_transfer_tip"
                                />
                                <span className="ml-1">:</span>
                              </th>
                              <td>
                                <div className="d-flex">
                                  <NavLink exact to={match.url + "/transfers"}>
                                    <div
                                      className="colorYellow"
                                      onClick={this.scrollToAnchor.bind(this)}
                                    >
                                      {stats.transactions} &nbsp;
                                    </div>
                                  </NavLink>
                                  Txns
                                  <div>
                                    <span className="ml-1">(</span>
                                    <i className="fa fa-arrow-down text-success" />
                                    &nbsp;
                                    <span>{stats.transactions_in} Txns</span>
                                    &nbsp;
                                    <i className="fa fa-arrow-up  text-danger" />
                                    &nbsp;
                                    <span>{stats.transactions_out} Txns</span>
                                    &nbsp;
                                    <span>)</span>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      )}
                    </div>
                    <div
                      className={`col-md-5 address-circle ${!address
                        .representative.enabled && "justify-content-center"}`}
                    >
                      <Resource
                        availableBandWidthPercentage={
                          availableBandWidthPercentage
                        }
                        netRemaining={netRemaining}
                        availableEnergyPercentage={availableEnergyPercentage}
                        energyRemaining={energyRemaining}
                        netLimit={netLimit}
                        energyLimit={energyLimit}
                        totalPower={totalPower}
                        powerPercentage={
                          ((totalPower - address.voteTotal) / totalPower) *
                            100 || 0
                        }
                        powerRemaining={totalPower - address.voteTotal}
                        address={this.props.match.params.id || ""}
                        isRepresentative={address.representative.enabled}
                        realTimeVotes={realTimeVotes}
                        realTimeRanking={realTimeRanking}
                        lastRanking={lastRanking}
                        lastCycleVotes={lastCycleVotes}
                        changeVotes={changeVotes}
                        changeRank={changeRank}
                      ></Resource>
                    </div>
                    {/* <div className="address-circle-bandwidth d-flex">
                        <Tooltip
                          title={this.bandWidthCircle}
                          overlayStyle={{ maxWidth: "500px" }}
                        >
                          <Progress
                            width={82}
                            strokeWidth={10}
                            showInfo={false}
                            type="circle"
                            strokeColor="#FFA30B"
                            strokeLinecap="square"
                            percent={availableBandWidthPercentage}
                          />
                        </Tooltip>

                        <div className="circle-info">
                          <div>{tu("address_netRemaining")}</div>
                          <h5>
                            <FormattedNumber
                              value={netRemaining ? netRemaining : 0}
                            />
                          </h5>
                        </div>
                      </div>
                      <div className="address-circle-line"></div>
                      <div className="address-circle-energy d-flex">
                        <Tooltip
                          title={this.energyCircle}
                          overlayStyle={{ maxWidth: "500px" }}
                        >
                          <Progress
                            width={82}
                            strokeWidth={10}
                            showInfo={false}
                            type="circle"
                            strokeColor="#4A90E2"
                            strokeLinecap="square"
                            percent={availableEnergyPercentage}
                          />
                        </Tooltip>
                        <div className="circle-info">
                          <div>{tu("address_energyRemaining")}</div>
                          <h5>
                            <FormattedNumber
                              value={energyRemaining ? energyRemaining : 0}
                            />
                          </h5>
                        </div>
                      </div>
                    </div> */}
                    {/*
                            <div className={address.representative.enabled ? 'col-md-6 mt-3 mt-md-0' : ''}>
                              {
                              address.representative.enabled && votes.length &&
                              <h4 className="text-center mt-3">Top {votes.length} {tu("voters")} {tu("addresses")}</h4>
                            }
                              {
                              address.representative.enabled &&
                            <PieReact style={{height: 340}} data={votes}/>
                            }
                            </div>
                           */}
                  </div>
                </div>
                <div className="card mt-3 list-style-body">
                  <div className="card-header list-style-body__header">
                    <ul className="nav nav-tabs card-header-tabs">
                      {Object.values(tabs).map(tab => (
                        <li key={tab.id} className="nav-item">
                          <NavLink
                            exact
                            to={match.url + tab.path}
                            className="nav-link text-dark"
                          >
                            <i className={tab.icon + " mr-2"} />
                            {tab.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="card-body p-0 list-style-body__body">
                    <Switch>
                      {Object.values(tabs).map(tab => (
                        <Route
                          key={tab.id}
                          exact
                          path={match.url + tab.path}
                          render={props => <tab.cmp block={address} />}
                        />
                      ))}
                    </Switch>
                  </div>
                </div>
                {[
                  "transfers",
                  "transactions",
                  "internal-transactions",
                  "blocks",
                  "voters"
                ].indexOf(tabName) !== -1 ? (
                  <CsvExport downloadURL={csvurl} />
                ) : (
                  ""
                )}
              </Fragment>
            )}
          </div>
        </div>
      </main>
    );
  }
}

function mapStateToProps(state) {
  return {
    tokens20: state.account.tokens20
  };
}

const mapDispatchToProps = {};

export default injectIntl(Address);
//export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Address));
