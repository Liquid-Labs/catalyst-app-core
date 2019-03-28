# Item CRUD walkthrough

This document provides a technical overview of the item update flow aimed at
developers.

## Create item

## Retrieve item

10. The data is loaded into a resource [`Model`](#resource-models) of the
    appropriate type. If the resource isn't properly mapped to a `Model` class,
    an exception will be raised.

## Resource Models

TODO: this section should move to @liquid-labs/catalyst-core-api once we have
cross-repo linking supported.

Resource `Model`s are any subclass of the `Model` class. When a remote fetch
succeeds, [resource success action](#resource-success-actions) converts the
raw JSON data into an instance of the abstract `Model` class immediately.

Thus, when speaking of 'resource items' or simply 'items', we are generally
referring to an instance of the abstract `Model` class. Only the resource
success actions and supporting code should ever deal directly with JSON data.

## Resource success actions

Though processing varies slightly based on the operation and whether the call
dealt with a single resource or list of resources, the resource success handlers
primary purpose is to convert the incoming JSON data into one or more
[`Model` instances](#resource-models) before any further processing.

## Update item

### Success flow

To initiate the update flow:

1. The resource item has been loaded into the [`ItemValidaitonContext`]() by
   the `ItemFetcher`.
2. The user interacts with the item fields through [`ValidInput`]() components.
3. After the user prepares the update and hits the submit control (typically
   provided by [`ItemControls`]()):
   1. `setIsItemUpdating(true)` is called to inidcate the item is updating.
   1. A new item instance is cloned from the original data and updated with the
      data exported by the `ItemValidationAPI`.
   2. This updated item is used in the REST-ful update call.
   3. Note that at this point in time, the item provided by `ItemContext` is
      out of sync with the updated item. Hence the `isItemUpdating` method.
      Components interacting the API should render a blank or disabled state
      when the item is updating.
4. Once a successful response is received, the `ItemContext` is updated via the
  `updateItem` method and `setIsItemUpdating(false)` is called.

### Failure flows

#### Remote API call indicates processing failure.

When the remote API call completes normally as far as the HTTP connection, but
indicates an error, then the remote data is unchanged.

* The user is given the [standard error feedback]().
* The original item data is still valid and should be retained.
* The interface should return to a ready state. Note that the user will be
  advised as to whether the error is 'permanent' or not, but the interface,
  aside from the advisory message itself, should always return to a ready state.

## ItemValidationContext

# TODO: Move this to the class docs.

`ItemValidationContext` provides the [`ItemValidationAPI`]() through the
[`useItemValidationAPI`]() hook. The `ItemValidationAPI` is compatible with the
[`FieldValidationAPI`]() and provides a superset of functions for descendent
validation and item components.
