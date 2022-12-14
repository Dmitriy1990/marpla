import { useEffect, useState, useMemo } from "react";
import "./index.scss";

import { useDispatch, useSelector } from "react-redux";
import { useGetCountQuery, useGetListQuery } from "../../redux/api/campaigns";
import { setCount, setList } from "../../redux/slices/Edit/campaign";

import { Backdrop, CircularProgress, ToggleButton } from "@mui/material";

import {
  CustomizedToggleButtonGroup,
  DataTable,
  Search,
} from "../../components";

import {
  SortedArticleTable,
  SortedSubjTable,
  SortedAdvertsTable,
} from "./components";

import { getStatusNameById, getTypeNameById } from "./helpers";
import { Loader } from "../../components/Loader";

export const CampaignList = () => {
  const campaign = useSelector((state) => state.campaign);
  const dispatch = useDispatch();

  const {
    data: campaignList,
    isLoading: isGetCampaignListLoading,
    isSuccess: isGetCampaignListSuccess,
  } = useGetListQuery();

  const {
    data: campaignsCount,
    isLoading: isGetCampaignsCountLoading,
    isSuccess: isGetCampaignsCountSuccess,
    isFetching,
  } = useGetCountQuery();

  useEffect(() => {
    if (!isGetCampaignListSuccess) return;

    dispatch(
      setList(
        campaignList.map((item) => ({
          ...item,
          Type: getTypeNameById(item.Type),
          statusId: getStatusNameById(item.statusId),
        }))
      )
    );
  }, [isGetCampaignListSuccess]);

  useEffect(() => {
    if (!isGetCampaignsCountSuccess) return;

    dispatch(setCount(campaignsCount));
  }, [isGetCampaignsCountSuccess]);

  const [sort, setSort] = useState(false);
  const [statusFilter, setStatusFilter] = useState("total");

  const setSortHandler = (_, sort) => setSort(sort);
  const setStatusFilterHandler = (_, status) => setStatusFilter(status);
  const filterCampaing = useMemo(() => {
    const newData = campaign.list.filter((item) => {
      if (statusFilter === "active") {
        return item.statusId === "Активна";
      } else if (statusFilter === "pause") {
        return item.statusId === "Приостановлено";
      } else if (statusFilter === "archive") {
        return item.statusId === "Показы завершены";
      } else {
        return true;
      }
    });
    return newData;
  }, [statusFilter, campaign]);

  return (
    <div className="campaign-list">
      <div className="container">
        <div className="campaign-list__inner">
          <div className="campaign-list__filters">
            <div className="campaign-list__group">
              <div className="campaign-list__group-text">Сгруппировать по:</div>

              <div className="campaign-list__group-buttons">
                <CustomizedToggleButtonGroup
                  className="campaign-list__toggle-group"
                  color="primary"
                  value={sort}
                  exclusive
                  onChange={setSortHandler}
                >
                  <ToggleButton value="subj">Предмету</ToggleButton>
                  <ToggleButton value="article">Артикулу</ToggleButton>
                  <ToggleButton value="adverts">Виду рекламы</ToggleButton>
                </CustomizedToggleButtonGroup>
              </div>
            </div>

            <div className="campaign-list__filter">
              <div className="campaign-list__filter-text">Показывать:</div>

              <div className="campaign-list__filter-buttons">
                <CustomizedToggleButtonGroup
                  className="campaign-list__toggle-group"
                  color="primary"
                  value={statusFilter}
                  exclusive
                  onChange={setStatusFilterHandler}
                >
                  <ToggleButton value="total">
                    Все ({campaign.count.total})
                  </ToggleButton>
                  <ToggleButton value="active">
                    Активные ({campaign.count.active})
                  </ToggleButton>
                  <ToggleButton value="pause">
                    Остановленные ({campaign.count.pause})
                  </ToggleButton>
                  <ToggleButton value="archive">
                    Архив ({campaign.count.archive})
                  </ToggleButton>
                </CustomizedToggleButtonGroup>
              </div>
            </div>
          </div>

          <Search />

          <div className="campaign-list__table">
            {sort ? (
              <div className="campaign-list__table-sorted">
                {sort === "article" && (
                  <SortedArticleTable rows={filterCampaing} />
                )}
                {sort === "subj" && <SortedSubjTable rows={filterCampaing} />}
                {sort === "adverts" && (
                  <SortedAdvertsTable rows={filterCampaing} />
                )}
              </div>
            ) : (
              <DataTable rows={filterCampaing} />
            )}
            <Loader loading={isGetCampaignListLoading} />
          </div>
        </div>
      </div>
    </div>
  );
};
