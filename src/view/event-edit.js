import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {convertToDateTime} from '../utils.js';
import {EVENT_TYPES} from '../const.js';

function getEventTypeTitle(eventType) {
  return eventType.charAt(0).toUpperCase() + eventType.slice(1);
}

function createEventEditElement(stateEvent, destinationList, offersList) {
  const {basePrice, dateFrom, dateTo, destination, type} = stateEvent;

  const currentDestination = destinationList.find((destinationItem) => destinationItem.id === destination);

  const typeOffers = offersList.find((offer) => offer.type === type);
  const offers = typeOffers ? typeOffers.offers : [];

  const startDayTime = convertToDateTime(dateFrom);
  const endDayTime = convertToDateTime(dateTo);

  return `<li class="trip-events__item">
              <form class="event event--edit" action="#" method="post">
                <header class="event__header">
                  <div class="event__type-wrapper">
                    <label class="event__type  event__type-btn" for="event-type-toggle-1">
                      <span class="visually-hidden">Choose event type</span>
                      <img class="event__type-icon" width="17" height="17" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
                    </label>
                    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

                    <div class="event__type-list">
                      <fieldset class="event__type-group">
                        <legend class="visually-hidden">Event type</legend>
                      ${EVENT_TYPES.map((eventType) => (
    `<div class="event__type-item">
                          <input id="event-type-${eventType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventType}">
                          <label class="event__type-label  event__type-label--${eventType}" for="event-type-${eventType}-1">${getEventTypeTitle(eventType)}</label>
                        </div>`
  )).join('')}
                      </fieldset>
                    </div>
                  </div>

                  <div class="event__field-group  event__field-group--destination">
                    <label class="event__label  event__type-output" for="event-destination-1">
                      ${type}
                    </label>
                    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${currentDestination ? currentDestination.name : ''}" list="destination-list-1">
                    <datalist id="destination-list-1">
                    ${destinationList.map((eventDestination) => (
    `<option value="${eventDestination.name}"></option>`
  )).join('')}
                    </datalist>
                  </div>

                  <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-1">From</label>
                    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startDayTime}">
                    &mdash;
                    <label class="visually-hidden" for="event-end-time-1">To</label>
                    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endDayTime}">
                  </div>

                  <div class="event__field-group  event__field-group--price">
                    <label class="event__label" for="event-price-1">
                      <span class="visually-hidden">Price</span>
                      &euro;
                    </label>
                    <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
                  </div>

                  <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                  <button class="event__reset-btn" type="reset">Delete</button>
                  <button class="event__rollup-btn" type="button">
                    <span class="visually-hidden">Open event</span>
                  </button>
                </header>
                <section class="event__details">
                ${offers.length !== 0 ?
    `<section class="event__section  event__section--offers">
                    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

                    <div class="event__available-offers">
                      ${offers.map((offer) => (
    `<div class="event__offer-selector">
                        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.title}" type="checkbox" name="event-offer-${offer.title}">
                        <label class="event__offer-label" for="event-offer-${offer.title}">
                          <span class="event__offer-title">${offer.title}</span>
                          &plus;&euro;&nbsp;
                          <span class="event__offer-price">${offer.price}</span>
                        </label>
                      </div>`
  )).join('')}
                    </div>
                  </section>` : ''}
                  ${currentDestination ?
    `<section class="event__section  event__section--destination">
                    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                    ${currentDestination.description ?
    `<p class="event__destination-description">${currentDestination.description}</p>` : ''}
                    ${currentDestination.pictures ?
    `<div class="event__photos-container">
                      <div class="event__photos-tape">
                      ${currentDestination.pictures.map((picture) => (
    `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`
  )).join('')}
                      </div>
                    </div>` : ''}
                  </section>` : ''}
                </section>
              </form>
            </li>`;
}

export default class EventEdit extends AbstractStatefulView {
  #destinationList = null;
  #offersList = null;
  #handleSubmitClick = null;
  #handleCancelClick = null;

  constructor({event, destinationList, offersList, onSubmitClick, onCancelClick}) {
    super();
    this.#destinationList = destinationList;
    this.#offersList = offersList;
    this.#handleSubmitClick = onSubmitClick;
    this.#handleCancelClick = onCancelClick;

    this._setState(EventEdit.parseEventToState(event));
    this._restoreHandlers();
  }

  get template() {
    return createEventEditElement(this._state, this.#destinationList, this.#offersList);
  }

  reset(event) {
    this.updateElement(
      EventEdit.parseEventToState(event),
    );
  }

  _restoreHandlers() {
    this.element.querySelector('.event__save-btn').addEventListener('click', this.#clickSubmitHandler);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#clickCancelHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#clickCancelHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#changeTypeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#changeDestinationHandler);
  }

  #clickSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleSubmitClick();
  };

  #clickCancelHandler = (evt) => {
    evt.preventDefault();
    this.#handleCancelClick();
  };

  #changeTypeHandler = (evt) => {
    this.updateElement({
      ...this._state,
      type: evt.target.value,
    });
  };

  #changeDestinationHandler = (evt) => {
    const newDestination = this.#destinationList.find((destinationItem) => destinationItem.name === evt.target.value);
    const newDestinationId = newDestination ? newDestination.id : null;
    this.updateElement({
      ...this._state,
      destination: newDestinationId,
    });
  };

  static parseEventToState(event) {
    return {...event};
  }

  static parseStateToTask(state) {
    return {...state};
  }
}
