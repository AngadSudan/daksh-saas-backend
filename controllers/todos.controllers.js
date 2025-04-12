import prismaClient from "../utils/db.js";
import ApiResponse from "../utils/ApiResponse.js";

//get todos for a user
const getTodosByUser = async (req, res) => {
  try {
    const user = req.user.id;
    if (!user) throw new Error("User token not found");

    const dbUser = await prismaClient.user.findUnique({
      where: { id: user },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    if (!dbUser) throw new Error("User not found");

    const todos = await prismaClient.todo.findMany({
      where: { createdBy: user, visibility: "VISIBLE" },
    });
    if (!todos)
      return res.status(200).json(new ApiResponse(200, "No todos found", []));

    return res.status(200).json(new ApiResponse(200, "Todos found", todos));
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json(
        new ApiResponse(500, error.message || "Internal Server Error", null)
      );
  }
};

//creating a new todo
const createTodo = async (req, res) => {
  try {
    const { title, description, deadline, priority } = req.body;
    const user = req.user.id;
    if (!title) throw new Error("please enter a title");
    if (!description) throw new Error("please enter a description");
    if (!deadline) throw new Error("please enter a deadline");
    if (!user) throw new Error("user token invalidated");

    const dbUser = await prismaClient.user.findFirst({
      where: { id: user },
    });
    console.log(dbUser);
    if (!dbUser) throw new Error("no dbUser found");

    const createdtodo = await prismaClient.todo.create({
      data: {
        createdBy: dbUser.id,
        title,
        description,
        deadline: new Date(deadline),
        priority: priority ?? "LOW",
      },
    });

    if (!createTodo) throw new Error("todo not created");

    res.status(200).json(new ApiResponse(200, "todo created", createdtodo));
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json(
        new ApiResponse(500, error.message || "Internal Server Error", null)
      );
  }
};

//updating a pre-exisitng todo
const updateTodo = async (req, res) => {
  try {
    const todoid = req.params.todoid;
    const userId = req.user.id;
    const { title, description, deadline, priority } = req.body;

    // Fetch the Todo with necessary fields
    const dbTodo = await prismaClient.todo.findUnique({
      where: { id: todoid },
      select: {
        id: true,
        createdBy: true,
        title: true,
        description: true,
        deadline: true,
      },
    });

    if (!dbTodo) throw new Error("Todo not found");
    if (dbTodo.createdBy !== userId)
      throw new Error("User not authorized to update this todo");

    if (!title && !description && !deadline)
      throw new Error("Please provide at least one field to update");

    // Convert deadline to Date only if provided
    const updatedTodo = await prismaClient.todo.update({
      where: { id: todoid },
      data: {
        title: title ?? dbTodo.title,
        description: description ?? dbTodo.description,
        deadline: deadline ? new Date(deadline) : dbTodo.deadline,
        priority: priority ?? dbTodo.priority,
      },
    });

    if (!updatedTodo) throw new Error("Todo update failed");

    return res
      .status(200)
      .json(new ApiResponse(200, "Todo updated successfully", updatedTodo));
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(
        new ApiResponse(500, error.message || "Internal Server Error", null)
      );
  }
};

//set the visibility to hidden (deletion analogy)
const setVisibilityHidden = async (req, res) => {
  try {
    const todoid = req.params.todoid;
    const userId = req.user.id;

    const dbTodo = await prismaClient.todo.findUnique({
      where: { id: todoid },
    });

    if (!dbTodo) throw new Error("Todo not found");
    const dbUser = await prismaClient.user.findUnique({
      where: { id: userId },
    });
    if (!dbUser) throw new Error("User not found");
    if (dbTodo.createdBy !== userId)
      throw new Error("User not authorized to delete this todo");

    const updatedTodo = await prismaClient.todo.update({
      where: { id: todoid },
      data: { visibility: "HIDDEN" },
    });
    if (!updatedTodo) throw new Error("Todo visibility not updated");

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Todo visibility updated successfully",
          updatedTodo
        )
      );
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json(
        new ApiResponse(500, error.message || "Internal Server Error", null)
      );
  }
};

// set the todo as completed
const toggleCompletionStatus = async (req, res) => {
  try {
    const todoid = req.params.todoid;
    const userId = req.user.id;

    const dbTodo = await prismaClient.todo.findUnique({
      where: { id: todoid },
    });
    if (!dbTodo) throw new Error("Todo not found");

    const dbUser = await prismaClient.user.findUnique({
      where: { id: userId },
    });
    if (!dbUser) throw new Error("User not found");

    if (dbTodo.createdBy !== userId)
      throw new Error("User not authorized to update this todo");

    const updatedTodo = await prismaClient.todo.update({
      where: { id: dbTodo.id },
      data: {
        status: dbTodo.status === "COMPLETED" ? "PENDING" : "COMPLETED",
      },
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, "Todo completion status updated", updatedTodo)
      );
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json(
        new ApiResponse(500, error.message || "Internal Server Error", null)
      );
  }
};

// set the priority of the todo  based on deadline
const setReminderForUrgency = async (req, res) => {
  try {
    const todoid = req.params.todoid;
    const userId = req.user.id;

    // Fetch Todo with only required fields
    const dbTodo = await prismaClient.todo.findUnique({
      where: { id: todoid },
      select: { id: true, createdBy: true, deadline: true },
    });
    if (!dbTodo) throw new Error("Todo not found");

    if (dbTodo.createdBy !== userId)
      throw new Error("User not authorized to update this todo");

    const dbTodoDeadline = new Date(dbTodo.deadline);
    const currentDate = new Date();

    // Calculate difference in days (rounded up)
    const diffInTime = dbTodoDeadline.getTime() - currentDate.getTime();
    const diffInDays = Math.ceil(diffInTime / (1000 * 3600 * 24));

    let calculatedPriority = "LOW"; // Default priority
    if (diffInDays <= 1) {
      calculatedPriority = "HIGH";
    } else if (diffInDays <= 3) {
      calculatedPriority = "MEDIUM";
    } else if (diffInDays <= 7) {
      calculatedPriority = "LOW";
    } else {
      calculatedPriority = "LOW"; // Ensuring default remains LOW beyond 7 days
    }

    // Update priority in the database
    const updatedTodo = await prismaClient.todo.update({
      where: { id: todoid },
      data: { priority: calculatedPriority },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, "Todo urgency status updated", updatedTodo));
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(
        new ApiResponse(500, error.message || "Internal Server Error", null)
      );
  }
};

// get all pinned todos
const getPinnedTodos = async (req, res) => {
  try {
    const user = req.user.id;
    const dbUser = await prismaClient.user.findUnique({
      where: { id: user },
    });

    if (!dbUser) throw new Error("User not found");

    const pinnedTodos = await prismaClient.todo.findMany({
      where: { createdBy: user, pinned: "PINNED", visibility: "VISIBLE" },
    });
    if (!pinnedTodos)
      return res
        .status(200)
        .json(new ApiResponse(200, "No pinned todos found", []));

    return res
      .status(200)
      .json(new ApiResponse(200, "Pinned todos found", pinnedTodos));
    // Your logic here
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json(
        new ApiResponse(500, error.message || "Internal Server Error", null)
      );
  }
};

// toggle the pin status of a todo
const togglePinStatus = async (req, res) => {
  try {
    const todoid = req.params.todoid;
    const userId = req.user.id;

    const dbTodo = await prismaClient.todo.findUnique({
      where: { id: todoid },
    });
    if (!dbTodo) throw new Error("Todo not found");

    const dbUser = await prismaClient.user.findUnique({
      where: { id: userId },
    });
    if (!dbUser) throw new Error("User not found");

    if (dbTodo.createdBy !== userId)
      throw new Error("User not authorized to pin this todo");

    const updatedTodo = await prismaClient.todo.update({
      where: { id: todoid },
      data: { pinned: dbTodo.pinned === "PINNED" ? "UNPINNED" : "PINNED" },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, "Todo pinned status updated", updatedTodo));
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json(
        new ApiResponse(500, error.message || "Internal Server Error", null)
      );
  }
};

export {
  getTodosByUser,
  createTodo,
  updateTodo,
  setVisibilityHidden,
  toggleCompletionStatus,
  setReminderForUrgency,
  getPinnedTodos,
  togglePinStatus,
};
