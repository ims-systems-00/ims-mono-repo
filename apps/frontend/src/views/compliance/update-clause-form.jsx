import {
  Button,
  Form,
  FormGroup,
  Label,
  Select,
  useDrawer,
  Row,
  Col,
} from "@ims-systems-00/ims-ui-kit";
import { Controller, useForm } from "react-hook-form";
import { useEffect } from "react";
import { updateISOControl } from "@/services/complianceToolsServices";

export const UpdateClause = ({ compliance, updateDataTable }) => {
  const { closeDrawer } = useDrawer();
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    mode: "onSubmit",
    defaultValues: {
      selected: compliance?.selected,
      state: compliance?.state,
    },
  });

  const handleUpdate = async (data) => {
    const payload = {
      clause: compliance?.control?.clause,
      name: compliance?.control?.name,
      selected: data?.selected,
      state: data?.state,
    };
    await updateISOControl(compliance?._id, payload);
    closeDrawer("complaince-detail");
    updateDataTable();
  };

  useEffect(() => {
    if (compliance) {
      reset({
        selected: compliance?.selected || "Selected",
        state: compliance?.state || "Implemented",
      });
    }
  }, [compliance, reset]);

  const selectedOptions = [
    { value: "Selected", label: "Selected" },
    { value: "Not selected", label: "Not selected" },
  ];

  const stateOptions = [
    { value: "Implemented", label: "Implemented" },
    { value: "Not implemented", label: "Not implemented" },
  ];

  return (
    <Form onSubmit={handleSubmit(handleUpdate)}>
      <Row>
        <Col md="6">
          <FormGroup>
            <Label htmlFor="selected">Select Control</Label>
            <Controller
              name="selected"
              control={control}
              render={({ field }) => (
                <Select
                  id="selected"
                  placeholder="Choose..."
                  options={selectedOptions}
                  isDisabled={compliance?.control?.isLocked}
                  value={
                    selectedOptions.find((opt) => opt.value === field.value) ||
                    null
                  }
                  onChange={(selected) => field.onChange(selected?.value || "")}
                  onBlur={field.onBlur}
                />
              )}
            />
          </FormGroup>
        </Col>

        <Col md="6">
          <FormGroup>
            <Label htmlFor="state">Status</Label>
            <Controller
              name="state"
              control={control}
              render={({ field }) => (
                <Select
                  id="state"
                  placeholder="Choose..."
                  isDisabled={compliance?.control?.isLocked}
                  options={stateOptions}
                  value={
                    stateOptions.find((opt) => opt.value === field.value) ||
                    null
                  }
                  onChange={(selected) => field.onChange(selected?.value || "")}
                  onBlur={field.onBlur}
                />
              )}
            />
          </FormGroup>
        </Col>
      </Row>

      <Button
        disabled={compliance?.control?.isLocked || isSubmitting}
        type="submit"
        color="primary"
      >
        {isSubmitting ? "Updating" : "Update"}
      </Button>
    </Form>
  );
};
