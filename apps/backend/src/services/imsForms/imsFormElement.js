const { Manager } = require("./manager");
const { APIError } = require("../../helpers/errors/apiError");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const { ImsForm } = require("./imsForm");
const mongoose = require("mongoose");

const population = [
  {
    path: "organization",
    select: "name logo",
  },
];
class ImsFormElement extends ImsForm {
  constructor(connection) {
    super(connection);
  }
  async handleLinkedListInsertion(
    newElement,
    previousFormElement,
    nextFormElement
  ) {
    // If previous and next is null, make the element the head
    if (!previousFormElement && !nextFormElement) {
      return await newElement.save();
    }

    // If previous exists and next is null, it's the last node
    if (previousFormElement && !nextFormElement) {
      const previousElement = await this.getImsFormElement({
        _id: previousFormElement,
      });

      previousElement.nextFormElement = newElement._id;
      await previousElement.save();
      return await newElement.save();
    }

    // If previous is null and next exists, it's the head node
    if (!previousFormElement && nextFormElement) {
      const nextElement = await this.getImsFormElement({
        _id: nextFormElement,
      });
      nextElement.previousFormElement = newElement._id;
      await nextElement.save();
      return await newElement.save();
    }

    // If both previous and next exist, insert between them
    if (previousFormElement && nextFormElement) {
      const previousElement = await this.getImsFormElement({
        _id: previousFormElement,
      });
      const nextElement = await this.getImsFormElement({
        _id: nextFormElement,
      });

      previousElement.nextFormElement = newElement._id;
      nextElement.previousFormElement = newElement._id;

      await previousElement.save();
      await nextElement.save();
      return await newElement.save();
    }
  }

  async createImsFormElement(data) {
    if (!data)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Data is required."
      );
    if (data.formId !== null) {
      await this.getImsForm({ _id: data.formId });
    }

    let {
      formId,
      type,
      attributes,
      validation,
      properties,
      children,
      previousFormElement,
      nextFormElement,
    } = data;

    let newImsFormElement = new this.ImsFormElement({
      formId,
      type,
      attributes,
      validation,
      properties,
      children,
      previousFormElement,
      nextFormElement,
      organization: this.connection.user.organizationId,
    });
    newImsFormElement = await this.handleLinkedListInsertion(
      newImsFormElement,
      previousFormElement,
      nextFormElement
    );

    return newImsFormElement.populate(population);
  }
  async getImsFormElement(query) {
    let exist = await this.ImsFormElement.findOne(query);
    if (!exist)
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "iMS Form element not found with given query."
      );
    return exist.populate(population);
  }
  async updateImsFormElement(id, data) {
    const { formId } = data;
    await this.getImsForm({ _id: formId });
    await this.getImsFormElement({ _id: id });

    let updatedImsFormElement = await this.ImsFormElement.findOneAndUpdate(
      { _id: id },
      { $set: { ...data } },
      { new: true }
    );
    // If linked list relationships are updated, handle them
    // if (previousFormElement || nextFormElement) {
    //   updatedImsFormElement = await this.handleLinkedListInsertion(
    //     updatedImsFormElement,
    //     previousFormElement,
    //     nextFormElement
    //   );
    // }

    return updatedImsFormElement.populate(population);
  }
  async changeImsFormElementOrder(
    id,
    { newPreviousFormElement, newNextFormElement }
  ) {
    // Fetch the IMS Form Element to move
    const imsFormElement = await this.getImsFormElement({ _id: id });

    // Fetch the neighboring elements (if any)
    const newPreviousElement = await this.ImsFormElement.findOne({
      _id: newPreviousFormElement,
    });

    const newNextElement = await this.ImsFormElement.findOne({
      _id: newNextFormElement,
    });

    console.log(id, newPreviousElement, newNextElement);

    // Detach the element from its current neighbors if it has any
    if (imsFormElement.previousFormElement) {
      const currentPrev = await this.getImsFormElement({
        _id: imsFormElement.previousFormElement,
      });
      if (currentPrev)
        currentPrev.nextFormElement = imsFormElement.nextFormElement;
      await currentPrev?.save();
    }

    if (imsFormElement.nextFormElement) {
      const currentNext = await this.getImsFormElement({
        _id: imsFormElement.nextFormElement,
      });
      if (currentNext)
        currentNext.previousFormElement = imsFormElement.previousFormElement;
      await currentNext?.save();
    }
    if (
      newPreviousElement &&
      imsFormElement.previousFormElement === newPreviousElement._id &&
      newNextElement &&
      imsFormElement.nextFormElement === newNextElement._id
    ) {
      return imsFormElement.populate(population);
    }

    // Reassign previous and next references for the moved element
    imsFormElement.previousFormElement = newPreviousElement
      ? newPreviousElement._id
      : null;
    imsFormElement.nextFormElement = newNextElement ? newNextElement._id : null;

    // If there's a previous element, update its `nextFormElement`
    if (newPreviousElement) {
      newPreviousElement.nextFormElement = imsFormElement._id;
      await newPreviousElement.save();
    }

    // If there's a next element, update its `previousFormElement`
    if (newNextElement) {
      newNextElement.previousFormElement = imsFormElement._id;
      await newNextElement.save();
    }
    await imsFormElement.save();

    return imsFormElement.populate(population);
  }

  async listImsFormElement(query, options) {
    const aggregate = this.ImsFormElement.aggregate([
      {
        $match: {
          ...query,
          organization: new mongoose.Types.ObjectId(
            this.connection.user.organizationId
          ),
          previousFormElement: null,
        },
      },

      // Use $graphLookup to recursively find all connected elements based on nextFormElement
      {
        $graphLookup: {
          from: "imsformelements",
          startWith: "$_id",
          connectFromField: "nextFormElement",
          connectToField: "_id",
          as: "formSequence",
          depthField: "order", // Track depth of recursion
        },
      },
      // Unwind the results for easy sorting and ordering
      {
        $unwind: "$formSequence",
      },
      // Sort the results by the recursion depth
      {
        $sort: { "formSequence.order": 1 },
      },
      // Project the ordered sequence
      {
        $project: {
          _id: "$formSequence._id",
          type: "$formSequence.type",
          attributes: "$formSequence.attributes",
          formId: "$formSequence.formId",
          children: "$formSequence.children",
          nextFormElement: "$formSequence.nextFormElement",
          previousFormElement: "$formSequence.previousFormElement",
          deleteMarker: "$formSequence.deleteMarker",
          organization: "$formSequence.organization",
        },
      },
    ]);
    const pagination = await this.ImsFormElement.aggregatePaginate(
      aggregate,
      options
    );
    return pagination;
  }
  async softRemoveImsFormElement(id) {
    const imsFormElement = this.getImsFormElement({ _id: id });
    if (imsFormElement) {
      await this.ImsFormElement.softDelete({ _id: id });
      return imsFormElement;
    }
  }
  async restoreImsFormElement(id) {
    const imsFormElement = await this.getImsFormElement({ _id: id });
    if (imsFormElement) {
      await this.ImsFormElement.restore({ _id: id });
      return imsFormElement;
    }
  }
  async hardRemoveImsFormElement(id) {
    const imsFormElement = await this.getImsFormElement({ _id: id });
    if (imsFormElement) {
      const previousElement = await this.ImsFormElement.findOne({
        _id: imsFormElement.previousFormElement,
      });
      const nextElement = await this.ImsFormElement.findOne({
        _id: imsFormElement.nextFormElement,
      });
      if (!previousElement && !nextElement) {
        await this.ImsFormElement.deleteOne({ _id: imsFormElement._id });
        return imsFormElement;
      }
      if (!previousElement && nextElement) {
        nextElement.previousFormElement = null;
        await nextElement.save();
        await this.ImsFormElement.deleteOne({ _id: imsFormElement._id });
        return imsFormElement;
      }
      if (previousElement && !nextElement) {
        previousElement.nextFormElement = null;
        await previousElement.save();
        await this.ImsFormElement.deleteOne({ _id: imsFormElement._id });
        return imsFormElement;
      }

      if (previousElement && nextElement) {
        previousElement.nextFormElement = nextElement._id;
        nextElement.previousFormElement = previousElement._id;
        await previousElement.save();
        await nextElement.save();
        await this.ImsFormElement.deleteOne({ _id: imsFormElement._id });
        return imsFormElement;
      }
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Element is in a bad state to delete."
      );
    }
  }
}

module.exports = { ImsFormElement };
