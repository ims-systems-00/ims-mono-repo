import classNames from "classnames";
import { Label } from "@ims-systems-00/ims-ui-kit";
import React, { useRef, useState } from "react";

function ImsEmailSelect({
  name = "emails",
  emails = [],
  onChange = () => {},
  placeholder = "Select emails",
  label = "",
  isHorizontal = false,
  mandatory = false,
  suggestionsType,
  value = [],
  signeeList = [],
  users = [],
  ...props
}) {
  const { removeSignee, selectedRow, processingSignee, setProcessingSignee } =
    props || {};
  const selectedEmailRef = useRef(null);
  const [email, setEmail] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedEmails, setSelectedEmails] = useState([]);

  React.useEffect(() => {
    if (emails.length > 0) {
      const suggestions = emails.map((email) => email);
      setSuggestions(suggestions);
    } else {
      setSuggestions([]);
    }
  }, []);

  React.useEffect(() => {
    if (processingSignee) {
      setSelectedEmails([]);
      setEmail("");
      setProcessingSignee(false);
    }
  }, [processingSignee]);

  /**
   * suggestionsType = All means all internal and external emails will be suggested
   * suggestionsType = Internal means only internal emails will be suggested. If any external email is typed, that will not added to selected emails list
   * suggestionsType = External means only external emails will be suggested. No internal emails will be suggested here. so any external emails typed here can be added to selected emails list
   */

  const handleChange = (event) => {
    let inputValue = event.target.value;
    if (suggestionsType === "All") {
      setEmail(inputValue);
      if (inputValue === "") setSuggestions(emails.map((email) => email));
      else {
        //filter out duplicate emails from emails array
        let newSuggestions = emails
          .filter(
            (email) =>
              email.startsWith(inputValue) && !selectedEmails.includes(email)
          )
          .map((email) => email);
        if (newSuggestions.find((suggestion) => suggestion === inputValue)) {
          newSuggestions.splice(newSuggestions.indexOf(inputValue), 1);
        }
        newSuggestions = [...new Set(newSuggestions)];
        setSuggestions([...newSuggestions, inputValue]);
      }
    } else if (suggestionsType === "Internal") {
      setEmail(inputValue);
      if (inputValue === "") setSuggestions(emails.map((email) => email));
      else {
        let newSuggestions = emails
          .filter((email) => !selectedEmails.includes(email))
          .map((email) => email);
        if (newSuggestions.find((suggestion) => suggestion === inputValue)) {
          newSuggestions.splice(newSuggestions.indexOf(inputValue), 1);
        }
        newSuggestions = [...new Set(newSuggestions)];
        setSuggestions([...newSuggestions, inputValue]);
      }
    } else if (suggestionsType === "External") {
      setEmail(inputValue);
      if (inputValue === "") setSuggestions(emails.map((email) => email));
      else {
        let newSuggestions = emails
          .filter(
            (email) =>
              email.startsWith(inputValue) &&
              !selectedEmails.includes(email) &&
              !validateEmail(email)
          )
          .map((email) => email);
        if (newSuggestions.find((suggestion) => suggestion === inputValue)) {
          newSuggestions.splice(newSuggestions.indexOf(inputValue), 1);
        }
        newSuggestions = [...new Set(newSuggestions)];
        setSuggestions([...newSuggestions, inputValue]);
      }
    }
  };
  const handleSuggestionClick = (suggestion) => {
    if (suggestionsType === "All") {
      if (validateEmail(suggestion)) {
        if (selectedEmails.find((email) => email === suggestion)) {
          return;
        } else {
          setSelectedEmails([...selectedEmails, suggestion]);
          onChange({
            currentTarget: {
              name: name,
              value: [...selectedEmails, suggestion],
            },
          });
          setEmail("");
          const newSuggestions = emails
            .filter((email) => email !== suggestion)
            .map((email) => email);
          setSuggestions(newSuggestions);
        }
      }
    } else if (suggestionsType === "Internal") {
      if (emails.find((name) => name === suggestion)) {
        if (selectedEmails.find((name) => name === suggestion)) {
          return;
        } else {
          setSelectedEmails([...selectedEmails, suggestion]);
          let selectedEmailId = users.find(
            (user) => user.name === suggestion
          )._id;
          let selectedEmailsIds = selectedEmails.map((name) => {
            let selectedEmailsId = "";
            users.forEach((user) => {
              if (user.name === name) {
                selectedEmailsId = user._id;
              }
            });
            return selectedEmailsId;
          });
          selectedEmailsIds = [...new Set(selectedEmailsIds)];
          let internalSigneeIds = [...selectedEmailsIds, selectedEmailId];
          internalSigneeIds = [...new Set(internalSigneeIds)];
          if (value && value.length > 0) {
            let valueEmailsIds = value.map((name) => {
              let valueEmailsId = "";
              users.forEach((user) => {
                if (user.name === name) {
                  valueEmailsId = user._id;
                }
              });
              return valueEmailsId;
            });
            internalSigneeIds = internalSigneeIds.filter(
              (id) => !valueEmailsIds.includes(id)
            );
          }
          onChange({
            currentTarget: {
              name: name,
              value: internalSigneeIds,
            },
          });

          setEmail("");
          const newSuggestions = emails
            .filter((email) => email !== suggestion)
            .map((email) => email);
          setSuggestions(newSuggestions);
        }
      }
    } else if (suggestionsType === "External") {
      if (validateEmail(suggestion)) {
        if (emails.find((email) => email === suggestion)) {
          return;
        }
        if (selectedEmails.find((email) => email === suggestion)) {
          return;
        }
        setSelectedEmails([...selectedEmails, suggestion]);
        onChange({
          currentTarget: {
            name: name,
            value:
              value.length > 0
                ? [...selectedEmails, suggestion].filter((email) => {
                    let emailFound = false;
                    value.forEach((val) => {
                      if (val === email) emailFound = true;
                    });
                    return !emailFound;
                  })
                : [...selectedEmails, suggestion],
          },
        });
        setEmail("");
        const newSuggestions = emails
          .filter((email) => email !== suggestion)
          .map((email) => email);
        setSuggestions(newSuggestions);
      }
    }
  };
  const handleSelectedEmailDelete = (index) => {
    setSelectedEmails(selectedEmails.filter((email, i) => i !== index));
    onChange({
      currentTarget: {
        name: name,
        value: selectedEmails.filter((email, i) => i !== index),
      },
    });
    selectedEmailRef.current.focus();
  };

  const suggestionList = suggestions.map((suggestion, index) => (
    <div
      className="suggestion"
      key={index}
      onClick={() => {
        handleSuggestionClick(suggestion);
        selectedEmailRef.current.focus();
      }}
    >
      {suggestion}
    </div>
  ));

  const selectedEmailsList = selectedEmails.map((email, index) => (
    <div key={index} className="selected-email">
      {email}
      <span
        onClick={() => {
          if (suggestionsType === "All") {
            handleSelectedEmailDelete(index);
          } else {
            if (suggestionsType === "Internal") {
              if (
                signeeList.find(
                  (signee) =>
                    signee.user?.internalRef?._id ===
                    users.find((user) => user.name === email)._id
                )?.status !== "Signed"
              ) {
                handleSelectedEmailDelete(index);
                onChange({
                  currentTarget: {
                    name: name,
                    value: selectedEmails
                      .filter((email, i) => i !== index)
                      .filter((email, i) => {
                        let emailFound = false;
                        value.forEach((val) => {
                          if (val === email) emailFound = true;
                        });
                        return !emailFound;
                      }),
                  },
                });
              }
            } else {
              if (
                signeeList.find((signee) => signee.user.externalEmail === email)
                  ?.status !== "Signed"
              ) {
                handleSelectedEmailDelete(index);
                onChange({
                  currentTarget: {
                    name: name,
                    value: selectedEmails
                      .filter((email, i) => i !== index)
                      .filter((email, i) => {
                        let emailFound = false;
                        value.forEach((val) => {
                          if (val === email) emailFound = true;
                        });
                        return !emailFound;
                      }),
                  },
                });
              }
            }
          }
        }}
      >
        <i className="ims-icons-20 icon-cancel-regular"></i>
      </span>
    </div>
  ));

  return (
    <div className="ims-email-select-container my-2">
      {label && (
        <Label
          style={{
            fontSize: "16px",
          }}
          sm={isHorizontal ? "12" : "2"}
          className={classNames("text-dark", {
            "text-left pl-0": isHorizontal,
            "text-right": !isHorizontal,
          })}
        >
          {label} {mandatory ? <span className={`text-danger `}>*</span> : ""}
        </Label>
      )}
      <div className="emails-container">
        <div className="selected-emails-container">{selectedEmailsList}</div>
        <input
          ref={selectedEmailRef}
          type="email"
          value={email}
          onChange={handleChange}
          placeholder={selectedEmails.length === 0 ? placeholder : ""}
        />
      </div>
      <div className={`suggestions-container mt-1 ${!email ? "d-none" : ""}`}>
        {suggestionList}
      </div>
    </div>
  );
}

const validateEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};
export default ImsEmailSelect;
