const BadgeSchema = new mongoose.Schema({
  name: String, // "Top Rated"
  criteria: String, // internal logic
  icon: String
});
