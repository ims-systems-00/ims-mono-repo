import classnames from "classnames";
import TooltipButton from "@/components/Tooltip/TooltipButton";
import { Button, Input, Table } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import IVal from "@/validations/validator";
import { v4 as uuiv4 } from "uuid";
const parseNumber = (number) => {
  return number && !isNaN(number) ? parseFloat(Math.abs(number)) : 0;
};
const ItemsTable = ({
  onRowUpdate = () => {},
  onCalculationUpdate = () => {},
  refresh,
  showAddItem,
  checkValidation = () => {},
  calculations: savedCalculations = {
    total: 0,
    discount: 0,
    vatFigure: 0,
  },
  tableData = [
    {
      id: "random-id",
      data: [
        { name: `item-nid-0`, type: "text", text: "", error: "" },
        { name: `unitPrice-nid-0`, type: "number", text: 0, error: "" },
        { name: `units-nid-0`, type: "number", text: 0, error: "" },
        { name: `vatRate-nid-0`, type: "number", text: 0, error: "" },
        { name: `vatFigure-nid-0`, type: "number", text: 0, error: "" },
        {
          className: "text-right",
          name: `subTotal-nid-0`,
          type: "number",
          text: 0,
          error: "",
        },
      ],
    },
  ],
  editMode = true,
  ...props
}) => {
  let [calculations, setCalcualtions] = React.useState(savedCalculations);
  function updateCalculation(calculations) {
    let subTotal = bodyData
      .map((row) => {
        return parseNumber(row.data[row.data.length - 1].text);
      })
      .reduce((total, current) => (total = total + current), 0);
    let vatFigure = bodyData
      .map((row) => {
        return parseNumber(row.data[row.data.length - 2].text);
      })
      .reduce((total, current) => (total = total + current), 0);
    let total =
      subTotal - (subTotal * parseNumber(calculations.discount)) / 100;
    setCalcualtions((prevCalc) => ({ ...prevCalc, total, vatFigure }));
  }
  const [bodyData, setBodyData] = React.useState(tableData);
  const addNewRow = () => {
    let id = uuiv4();
    setBodyData((prevItems) => [
      ...prevItems,
      {
        id: id,
        data: [
          {
            name: `item-nid-${id}`,
            type: "text",
            text: "",
            error: "invalid",
          },
          {
            name: `unitPrice-nid-${id}`,
            type: "number",
            text: 0,
            error: "",
          },
          {
            name: `units-nid-${id}`,
            type: "number",
            text: 0,
            error: "",
          },
          {
            name: `vatRate-nid-${id}`,
            type: "number",
            text: 0,
            error: "",
          },
          {
            name: `vatFigure-nid-${id}`,
            type: "number",
            text: 0,
            error: "",
          },
          {
            className: "text-right",
            name: `subTotal-nid-${id}`,
            type: "number",
            text: 0,
            error: "",
          },
        ],
      },
    ]);
  };
  const removeRow = (index) => {
    setBodyData((prevItems) => prevItems.filter((item, i) => i !== index));
  };
  const [column, setColumn] = React.useState({
    name: -1,
    order: "",
  });
  const validateTable = () => {
    let isValid =
      bodyData.length &&
      !validation({
        currentTarget: { value: calculations.discount, name: "discount" },
      })
        ? true
        : false;
    bodyData.forEach((entry) => {
      entry.data.forEach((data) => {
        if (data.error) isValid = false;
      });
    });
    return isValid;
  };
  const validation = (e) => {
    let { currentTarget } = e;
    let schema;
    if (currentTarget.name.includes("item-nid-")) {
      schema = IVal.string().required().label(currentTarget.name);
    }
    if (currentTarget.name.includes("unitPrice-nid-")) {
      schema = IVal.number().min(1).label(currentTarget.name);
    }
    if (currentTarget.name.includes("units-nid-")) {
      schema = IVal.number().min(1).label(currentTarget.name);
    }
    if (currentTarget.name.includes("vatRate-nid-")) {
      schema = IVal.number().min(0).max(100).label(currentTarget.name);
    }
    if (currentTarget.name.includes("vatFigure-nid-")) {
      schema = IVal.number().min(0).label(currentTarget.name);
    }
    if (currentTarget.name.includes("discount")) {
      schema = IVal.number().min(0).max(100).label(currentTarget.name);
    }

    let { error } = schema.validate(currentTarget.value);
    if (error) return error.message;
    return error;
  };
  const handleChange = (e, colIndex) => {
    let errorMessage = validation(e);
    let { currentTarget } = e;
    let name = currentTarget.name;
    let rowId = name.split("nid-")[1];
    let updatedRow = { ...bodyData.find((v) => v.id === rowId) };
    updatedRow.data[colIndex].text = currentTarget.value;
    updatedRow.data[colIndex].error = errorMessage;
    let vat =
      parseNumber(updatedRow.data[1].text) *
      parseNumber(updatedRow.data[2].text) *
      (parseNumber(updatedRow.data[3].text) / 100);
    vat = vat.toFixed(2);
    /** updating vat figure */
    updatedRow.data[4].text = vat;
    /** updating subtotal */
    updatedRow.data[5].text =
      parseNumber(updatedRow.data[1].text) *
        parseNumber(updatedRow.data[2].text) +
      parseNumber(vat);
    setBodyData((prevItems) =>
      prevItems.map((item) => (item.id === rowId ? updatedRow : item))
    );
  };
  React.useEffect(() => {
    updateCalculation(calculations);
  }, [bodyData]);
  React.useEffect(() => {
    checkValidation(validateTable());
    onCalculationUpdate({ calculations });
  }, [calculations]);
  React.useEffect(() => {
    checkValidation(validateTable());
    onRowUpdate({ entries: bodyData });
  }, [bodyData]);
  React.useEffect(() => {
    if (refresh) setBodyData([]);
  }, [refresh]);
  React.useEffect(() => {
    if (refresh) setCalcualtions({ discount: 0 });
  }, [refresh]);

  const sortTable = (key) => {
    let order = "";
    if (
      (column.name === key && column.order === "desc") ||
      column.name !== key
    ) {
      order = "asc";
      bodyData.sort((a, b) =>
        a.data[key].text > b.data[key].text
          ? 1
          : a.data[key].text < b.data[key].text
          ? -1
          : 0
      );
    } else if (column.name === key && column.order === "asc") {
      order = "desc";
      bodyData.sort((a, b) =>
        a.data[key].text > b.data[key].text
          ? -1
          : a.data[key].text < b.data[key].text
          ? 1
          : 0
      );
    }
    setBodyData(bodyData);
    setColumn({
      name: key,
      order: order,
    });
  };
  return (
    <>
      <Table>
        <thead className="text-primary">
          <tr>
            {[
              { text: "Items/Service provisions" },
              { text: "Price" },
              { text: "Quantity" },
              { text: "VAT%" },
              { text: "VAT (£)" },
              { text: "Amount (£)" },
            ].map((prop, key) => {
              return (
                <th
                  className={classnames(
                    "header",
                    {
                      headerSortDown:
                        key === column.name && column.order === "asc",
                    },
                    {
                      headerSortUp:
                        key === column.name && column.order === "desc",
                    },
                    {
                      [prop.className]: prop.className !== undefined,
                    }
                  )}
                  key={key}
                  onClick={() => sortTable(key)}
                >
                  {prop.text}
                </th>
              );
            })}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {bodyData.map((prop, key) => {
            return (
              <tr
                className={classnames({
                  [prop.className]: prop.className !== undefined,
                })}
                key={key}
              >
                {prop.data.map((data, k) => {
                  return (
                    <td
                      className={classnames({
                        [data.className]: data.className !== undefined,
                      })}
                      key={k}
                    >
                      {k === prop.data.length - 1 ||
                      k === prop.data.length - 2 ? (
                        data.text
                      ) : editMode ? (
                        <Input
                          type={data.type}
                          name={data.name}
                          onChange={(e) => {
                            handleChange(e, k);
                          }}
                          value={data.text}
                        />
                      ) : (
                        data.text
                      )}
                    </td>
                  );
                })}
                <td>
                  {editMode && (
                    <TooltipButton
                      onClick={(e) => {
                        removeRow(key);
                      }}
                      name="delete"
                      size="sm"
                      id="delete"
                      tooltip="Delete"
                      color="link"
                      outline
                      className="btn-link-danger border border-0"
                    >
                      <i className="ims-icons-20 icon-icon-trash-24 text-danger" />
                    </TooltipButton>
                  )}
                </td>
              </tr>
            );
          })}
          <tr>
            <td colSpan={4}>
              {!showAddItem && editMode && (
                <Button
                  className="btn-primary "
                  onClick={() => addNewRow(bodyData.length)}
                >
                  Add Item
                </Button>
              )}
            </td>
            <td className="text-info text-right">Discount %</td>
            <td className="text-right">
              {editMode ? (
                <Input
                  type={"number"}
                  value={calculations.discount}
                  onChange={(e) => {
                    let value = e.currentTarget.value;
                    setCalcualtions((prev) => ({ ...prev, discount: value }));
                    updateCalculation({ ...calculations, discount: value });
                  }}
                />
              ) : (
                calculations.discount
              )}
            </td>
            <td></td>
          </tr>
          <tr>
            <td colSpan={4}></td>
            <td className="text-success text-right">Total Vat (£)</td>
            <td className=" text-right">
              {parseFloat(calculations.vatFigure).toFixed(2)}
            </td>
            <td></td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={4}></td>
            <td className="text-success text-right">Total amount (£)</td>
            <td className=" text-right">
              {parseFloat(calculations.total).toFixed(2)}
            </td>
            <td></td>
          </tr>
        </tfoot>
      </Table>
    </>
  );
};

export default ItemsTable;
