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

1. The resource item is loaded into the [`ItemValidaitonContext`]().
2. The user interacts with the item fields normally through [`ValidInput`]()
   components.
3. After the user prepare the update and hits the submit control (typically
   provided by [`ItemControls`]()), the original item instance is updated with
   the data exported by the `ItemValidationAPI`.
   * This creates a new instance with updated data.
   * At this point in time, the original instance is preserved by the
     `ItemValidaitonContext`, but wrapped `ValidationContext` reflects the
     updated data.
   * Because the data sets are divergent, the `ItemValidationAPI` provides
     the `isItemAvailable` method, which returns `false` before the item has
     been fetched or while the item is being updated. Components interacting
     the API should render a blank or disabled state when the item is
     unavailable.
4. Once a successful response is received, the `ItemValidationContext` is
   updated via the `updateItem` method. Updating the item has the effect of
   making the item available again.

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
