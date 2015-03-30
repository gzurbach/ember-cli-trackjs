import Ember from 'ember';

export function initialize(container, application) {

  if (window.trackJs) {
    window.trackJs.configure({
      onError: function (payload, err) {

        // Exclude errors from login page
        if (payload.url && payload.url.indexOf('login') > 0) {
          return false;
        }
        return true;
      }
    });
  }

  // http://docs.trackjs.com/Examples/Integrating_with_Ember
  Ember.onerror = function (err) {
    if (window.trackJs) {
      window.trackJs.track(err);
    }

    Ember.Logger.assert(false, err);
  };

  Ember.RSVP.on('error', function (err) {

    if (err) {

      // Ignore 'TransitionAborted' errors
      if (err.message && err.message === 'TransitionAborted') {
        return;
      }

      // Most RSVP errors are instances of Object, not Error
      // Extract the error message from those
      if (!(err instanceof Error)) {
        if (err.message) {
          err = new Error(err.message);
        } else if (err.responseText) {
          err = new Error(err.responseText);
        }
      }
    }

    if (window.trackJs) {
      window.trackJs.track(err);
    }

    Ember.Logger.assert(false, err);
  });
}

export default {
  name: 'configure-trackjs',
  initialize: initialize
};
