import Box from "@/components/Box/Index";
import Loading from "@/components/Loader/Loading";
import { DrawerRight, useDrawer, DataTable } from "@ims-systems-00/ims-ui-kit";
import SearchInput from "@/components/SearchInput/search-input";
import RowActions from "./RowActions";
import React, { useMemo } from "react";
import BadgeStatus from "@/views/shared/StatusMapper/BadgeStatus";
import TimeDateComponent from "@/views/shared/TimeDateComponent";
import CreateTask from "./CreateTask";
import TaskDrawerDetail from "./TaskDrawerDetail";
import TaskDrawerForm from "./TaskDrawerForm";
import TaskFilter from "./TaskFilter";
import TaskForm from "./TaskForm";
import TaskToolBar from "./TaskToolbar";
import USER_ACTIONS from "./actions";
import { useTask } from "./store";
import { Pagination } from "@/components/Pagination/pagination";

const TaskTable = (props) => {
  let { openDrawer, closeDrawer } = useDrawer();
  let {
    processing,
    alert,
    tasks,
    TaskQueryTools,
    getStatusColor,
    getAssignee,
    handleCreateTask,
    moduleType,
    module,
    visitTask,
  } = useTask();

  const columns = useMemo(() => {
    return [
      {
        accessorKey: "reference",
        header: "Reference",
      },
      {
        accessorKey: "name",
        header: "Task",
        cell: ({ row }) => row.original?.name || "N/A",
      },
      {
        accessorKey: "assignedTo",
        header: "Assigned to",
        cell: ({ row }) => getAssignee(row.original),
      },

      {
        accessorKey: "priority",
        header: "Priority",
        cell: ({ row }) => (
          <span className={getStatusColor(row.original.priority)}>
            {row.original.priority}
          </span>
        ),
      },
      {
        accessorKey: "completed.status",
        header: "Status",
        cell: ({ row }) => (
          <BadgeStatus status={row.original.completed.status} />
        ),
      },
      {
        accessorKey: "due",
        header: "Due date",
        cell: ({ row }) => <TimeDateComponent date={row?.original?.due} />,
      },

      {
        id: "actions",
        accessorKey: "",
        size: 50,
        header: () => <div className="dt-row-actions">Actions</div>,
        cell: ({ row }) => <RowActions row={row} />,
      },
    ];
  }, [processing]);

  return (
    <Box>
      {alert}
      <h4 className="mb-3">Tasks</h4>
      <div className="row align-items-center mb-3">
        <div className="col-md-6">
          <div className="row g-2 align-items-center">
            <div className="col-md-8">
              <SearchInput queryHandlers={TaskQueryTools} />
            </div>
            <div className="col-md-4">
              <TaskFilter />
            </div>
          </div>
        </div>

        <div className="col-md-6 text-end">
          <CreateTask />
        </div>
      </div>

      {processing[USER_ACTIONS.LOAD_TASKS].status ? (
        <Loading  height={600}/>
      ) : (
        <>
          <DataTable
            data={tasks || []}
            columns={columns}
            disableMultiSelection={true}
            disableColumnResize={false}
            onRowClick={(row) => {
              const task = row?.original;
              if (task) {
                visitTask(task);
                openDrawer("task-detail");
              }
            }}
            defaultSize={250}
            minSize={80}
            columnVisibility={{}}
          />

          <Pagination
            containerClassName="pull-right my-2"
            totalCount={TaskQueryTools.toolState.pagination?.totalResults}
            currentPage={TaskQueryTools.toolState.pagination?.currentPage || 1}
            pageSize={TaskQueryTools.toolState.pagination?.size || 10}
            onPageChange={(page) => {
              TaskQueryTools?.handlePagination({ page });
            }}
          />
        </>
      )}

      <DrawerRight
        toolbar={<TaskToolBar />}
        onDrawerClose={() => {
          visitTask(null);
        }}
        drawerId="task-detail"
      >
        <TaskDrawerDetail />
      </DrawerRight>
      <DrawerRight drawerId="edit-task-form">
        <TaskDrawerForm />
      </DrawerRight>
      <DrawerRight drawerId="create-task">
        <TaskForm
          drawerView={true}
          processing={processing}
          module={module}
          moduleType={moduleType}
          onSubmit={async (data) => {
            await handleCreateTask(data);
            closeDrawer("create-task");
            openDrawer("task-detail");
          }}
        />
      </DrawerRight>
    </Box>
  );
};

export default TaskTable;
