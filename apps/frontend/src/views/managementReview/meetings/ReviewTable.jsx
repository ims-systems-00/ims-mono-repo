import { DataTable, DrawerRight, useDrawer } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import BadgeStatus from "@/views/shared/StatusMapper/BadgeStatus";
import TimeDateComponent from "@/views/shared/TimeDateComponent";
import TaskForm from "@/views/taskManagement/TaskForm";
import { useTask } from "@/views/taskManagement/store";
import ReviewDrawerDetail from "./ReviewDrawerDetail";
import ReviewDrawerForm from "./ReviewDrawerForm";
import ManagmentReviewForm from "./ReviewForm";
import ReviewToolBar from "./ReviewToolBar";
import { useSchedule } from "./store";
import USER_ACTIONS from "./actions";
import Loading from "@/components/Loader/Loading";
import Box from "@/components/Box/Index";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper";
import { RowActions } from "./row-actions";
import { Pagination } from "@/components/Pagination/pagination";
import SearchInput from "@/components/SearchInput/search-input";
import CreateReview from "./CreateReview";
import ReviewFilter from "./ReviewFilter";

const defaultdata = [["No data found"]];

const ReviewTable = ({ ...props }) => {
  let {
    managementReviews: dataTable,
    processing,
    visitingReview,
    visitReview,
    ReviewQueryTools,
    createReview,
    reloadReview,
  } = useSchedule();
  let { handleCreateTask } = useTask();
  let { openDrawer, closeDrawer } = useDrawer();

  dataTable = dataTable ? dataTable : defaultdata;

  const columnsForReview = [
    {
      accessorKey: "reference",
      header: () => <p>Reference</p>,
      size: 270,
    },
    {
      accessorKey: "title",
      header: () => <p>Title</p>,
      size: 350,
    },
    {
      accessorKey: "status",
      header: () => <p>Status</p>,
      cell: ({ row }) => (
        <BadgeStatus
          status={row?.original.completed.status ? "Completed" : "Scheduled"}
        />
      ),
      size: 250,
    },

    {
      accessorKey: "timeStamp",
      header: () => <p>Timestamp</p>,
      cell: ({ row }) => <TimeDateComponent date={row?.original.date} />,
      size: 270,
    },

    {
      accessorKey: "interval",
      header: () => <p>Interval</p>,
      size: 290,
    },
    {
      id: "actions",
      header: () => <p className="dt-row-actions">Action</p>,
      cell: ({ row }) => <RowActions row={row} />,
      size: 150,
    },
  ];

  return (
    <ContentWrapper>
      <Box>
        <h4 className="mb-3">Management reviews</h4>
        <div className="row align-items-center mb-3">
          <div className="col-md-6">
            <div className="row g-2 align-items-center">
              <div className="col-md-8">
                <SearchInput queryHandlers={ReviewQueryTools} />
              </div>
              <div className="col-md-4">
                <ReviewFilter />
              </div>
            </div>
          </div>

          <div className="col-md-6 text-end">
            <CreateReview />
          </div>
        </div>

        {processing[USER_ACTIONS.LOAD_REVIEWS].status ? (
          <Loading height={600} />
        ) : (
          <>
            <div>
              <DataTable
                data={dataTable}
                columns={columnsForReview || []}
                disableMultiSelection={true}
                disableColumnResize={false}
                defaultSize={375}
                minSize={80}
                onRowClick={({ original }) => {
                  visitReview(original);
                  openDrawer("review-detail");
                }}
                columnVisibility={{}}
              />
            </div>

            <Pagination
              containerClassName="pull-right my-2"
              totalResults={
                ReviewQueryTools?.toolState?.pagination?.totalResults
              }
              currentPage={
                ReviewQueryTools?.toolState?.pagination?.currentPage || 1
              }
              onPageChange={(page) => {
                ReviewQueryTools?.handlePagination({ page });
              }}
              size={ReviewQueryTools?.toolState?.pagination?.size || 10}
            />
          </>
        )}

        <DrawerRight
          drawerId="review-detail"
          onDrawerClose={() => {
            visitReview(null);
          }}
          toolbar={<ReviewToolBar />}
        >
          {<ReviewDrawerDetail />}
        </DrawerRight>
        <DrawerRight drawerId="edit-review-form">
          {visitingReview && <ReviewDrawerForm />}
        </DrawerRight>
        <DrawerRight drawerId="add-task-form">
          {visitingReview && (
            <TaskForm
              drawerView={true}
              module={visitingReview._id}
              moduleType="managementreviews"
              onSubmit={async (data) => {
                await handleCreateTask(data);
                closeDrawer("add-task-form");
                reloadReview();
              }}
            />
          )}
        </DrawerRight>
        <DrawerRight drawerId="create-review">
          <ManagmentReviewForm
            drawerView={true}
            onSubmit={async (data) => {
              await createReview(data);
              closeDrawer("create-review");
              openDrawer("review-detail");
            }}
          />
        </DrawerRight>
      </Box>
    </ContentWrapper>
  );
};

export default ReviewTable;
