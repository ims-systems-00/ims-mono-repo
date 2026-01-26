import Loading from "@/components/Loader/Loading";
import { DataTable, DrawerRight, useDrawer } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { useTagsAndCategories } from "./store";
import USER_ACTIONS from "./store/actions";
import CreateTagsAndCategories from "./CreateTagsAndCategories";
import TagsAndCategoryForm from "./TagsAndCategoryForm";
import TagsDrawerDetail from "./TagsDrawerDetail";
import TagsToolBar from "./TagsToolBar";
import TagsDrawerForm from "./TagsDrawerForm";
import Box from "@/components/Box/Index";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper";
import { Pagination } from "@/components/Pagination/pagination";
import { RowActions } from "./row-actions";
import SearchInput from "@/components/SearchInput/search-input";
import { TourStep } from "../../components/Tour";

const defaultdata = [["No data found"]];

const TagsAndCategoriesTable = ({ ...props }) => {
  let {
    tagsAndCategories: dataTable,
    processing,
    visitTagsCategory,
    queryHandlers,
    createTagsAndCategories,
  } = useTagsAndCategories();
  let { closeDrawer } = useDrawer();

  dataTable = dataTable ? dataTable : defaultdata;

  const columnsForCategories = [
    {
      accessorKey: "name",
      header: () => <p>Name</p>,
      cell: ({ row }) => (
        <span>
          <i className="ims-icons-20 icon-icon-key-16" /> {row?.original.name}
        </span>
      ),
      size: 320,
    },
    {
      accessorKey: "description",
      header: () => <p>Description</p>,
      size: 600,
    },
    {
      accessorKey: "score",
      header: () => <p>Applicable Modules</p>,
      cell: ({ row }) =>
        row?.original?.applicableModules.map((applicableModule) => (
          <span>{applicableModule} </span>
        )),
      size: 400,
    },

    {
      id: "actions",
      header: () => <p className="dt-row-actions">Action</p>,
      cell: ({ row }) => <RowActions row={row} />,
      size: 100,
    },
  ];

  return (
    <ContentWrapper>
      <Box>
        <h4 className="mb-3">Categories</h4>
        <div className="row align-items-center mb-3">
          <div className="col-md-6">
            <div className="row g-2 align-items-center">
              <div className="col-md-8">
                <SearchInput queryHandlers={queryHandlers} />
              </div>
            </div>
          </div>

          <div className="col-md-6 text-end">
            <TourStep stepId="create-information-button">
              <CreateTagsAndCategories />
            </TourStep>
          </div>
        </div>
        {processing[USER_ACTIONS.LIST_TAG_AND_CATEGORY].status ? (
          <Loading HEIGHT={600} />
        ) : (
          <>
            <div>
              <DataTable
                data={dataTable}
                columns={columnsForCategories || []}
                disableMultiSelection={true}
                disableColumnResize={false}
                defaultSize={375}
                minSize={80}
                columnVisibility={{}}
              />
            </div>

            <Pagination
              containerClassName="pull-right my-2"
              totalResults={queryHandlers?.toolState?.pagination?.totalResults}
              currentPage={
                queryHandlers?.toolState?.pagination?.currentPage || 1
              }
              onPageChange={(page) => {
                queryHandlers?.handlePagination({ page });
              }}
              size={queryHandlers?.toolState?.pagination?.size || 10}
            />
          </>
        )}

        <DrawerRight drawerId="create-tag">
          <TagsAndCategoryForm
            drawerView={true}
            onSubmit={async (data) => {
              await createTagsAndCategories(data);
              closeDrawer("create-tag");
              // openDrawer("tag-detail");
            }}
          />
        </DrawerRight>
        <DrawerRight
          drawerId="tag-detail"
          onDrawerClose={() => {
            visitTagsCategory(null);
          }}
          toolbar={<TagsToolBar />}
        >
          <TagsDrawerDetail />
        </DrawerRight>
        <DrawerRight drawerId="edit-tag-form">
          <TagsDrawerForm />
        </DrawerRight>
      </Box>
    </ContentWrapper>
  );
};

export default TagsAndCategoriesTable;
