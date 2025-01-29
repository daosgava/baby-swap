const pointsService = {
  updatePoints: async (points, recipientId) => {
    try {
      const response = await fetch("/api/points", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({
          points,
          recipientId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update points");
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error updating points:", error);
      throw error;
    }
  },
  getPoints: async () => {
    try {
      const response = await fetch("/api/points", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to get points");
      }

      const result = await response.json();
      return result.points;
    } catch (error) {
      console.error("Error getting points:", error);
      throw error;
    }
  },
};

export default pointsService;
