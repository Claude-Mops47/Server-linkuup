const getCookies = (req, res) => {
  const myCookieValue = req.cookie.jwt;
  res.json(`Valeur du cookie : ${myCookieValue}`);
};

const delCookie = (req, res) => {
  res.clearCookie("jwt");
  res.send("Cookie supprimé avec succès");
};

export { getCookies, delCookie };
