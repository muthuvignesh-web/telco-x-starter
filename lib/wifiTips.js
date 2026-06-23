// TODO: replace with real vision model call (e.g. Claude claude-sonnet-4-6 multimodal API)
function getTips(modemCondition, floorplanCondition) {
  // TODO: map modemCondition and floorplanCondition to tailored tip sets
  return [
    'Place your modem in a central location to distribute the signal evenly across all rooms.',
    'Keep the modem elevated — on a shelf or desk — rather than on the floor to improve coverage.',
    'Avoid placing the modem near thick concrete or brick walls, which can significantly reduce range.',
    'Keep the modem away from other electronics such as microwaves and cordless phones that cause interference.',
    'If coverage is poor in distant rooms, consider a Wi-Fi extender or mesh network node positioned halfway between the modem and the dead zone.',
  ];
}

module.exports = { getTips };
