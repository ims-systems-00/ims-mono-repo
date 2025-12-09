import { Button, Col, Row, Spinner } from "@ims-systems-00/ims-ui-kit";
import USER_ACTIONS from "../actions";
import { useExpenseReport } from "../store";
import ExpenseForm from "./ExpenseForm";

const Expense = ({ expense }) => {
  let { processing, editMode, toggleEditMode, handleDeleteExpense } =
    useExpenseReport();
  return editMode ? (
    <ExpenseForm expense={expense} toggleEditMode={toggleEditMode} />
  ) : (
    <div className="content">
      <Row className="">
        <Col md="2">
          <span className="text-right">
            <span className="">{expense.type} </span>{" "}
            {/* {<i className="tim-icons icon-bank" />}{" "} */}
          </span>
        </Col>
        <Col md="10">
          <Row>
            <Col md="8">
              <span>
                Description:
                <span className="text-secondary">
                  {" "}
                  {expense.description}{" "}
                </span>{" "}
              </span>
            </Col>
            <Col md="2">
              <p>£{expense.cost}</p>
            </Col>
            <Col md="2">
              <Button
                size="sm"
                id="detail"
                className="border-0"
                color="link"
                onClick={() => toggleEditMode()}
              >
                <i className="ims-icons-20 icon-icon-pencil-24" />
              </Button>{" "}
              <Button
                disabled={
                  processing[USER_ACTIONS.DELETE_TRAVEL].status &&
                  processing[USER_ACTIONS.DELETE_TRAVEL].id === expense._id
                }
                size="sm"
                name="delete"
                id="delete"
                color="link"
                className="btn-link-danger border border-0"
                onClick={() => handleDeleteExpense(expense._id)}
              >
                {processing[USER_ACTIONS.DELETE_TRAVEL].status &&
                processing[USER_ACTIONS.DELETE_TRAVEL].id === expense._id ? (
                  <Spinner size="sm" />
                ) : (
                  <i className="ims-icons-20 icon-icon-trash-24" />
                )}
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default Expense;
