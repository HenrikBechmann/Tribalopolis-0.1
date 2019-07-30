let parameters = {
  "control_account": "accounts/system",
  "control_groups": [],
  "control_owner": "members/bLkOyzNbjABj2iaKbOJa",
  "control_permissions_groups": [],
  "control_permissions_member": [],
  "control_permissions_owner": [],
  "control_permissions_public": [],
  "control_permissions_user": [],
  "control_type_logical": "system",
  "control_type_reference": "types/system",
  "control_type_version": 0,
  "control_useraccount": "accounts/VyfFksGi0Ehv7unaMoI0",
  "control_version": 0,
  "counts": {},
  "history": {
    "created": null,
    "createdby": {
      "member": null,
      "surrogate": null
    },
    "updated": null,
    "updatedby": {
      "member": null,
      "surrogate": null
    }
  },
  "properties": {
    "accountsettingspage": "system/accountsettings",
    "dateformat": "DD-MMM-YYYY",
    "datetimeformat": "DD-MMM-YYYY, HH:MM",
    "defaultschema": "system/commonschema",
    "languages": {
      "codes": "ISO639-2",
      "default": "en",
      "list": "system/languages",
      "standard": "ISO639"
    },
    "registerpage":"system/register",
    "systemschema": "system/systemschema",
    "tagline": "Tribalopolis is a virtual city of tribes"
  },
  "references": {},
  "standard_dates_end": null,
  "standard_dates_start": null,
  "standard_name_long": null,
  "standard_name_medium": null,
  "standard_name_short": null
}

let systemtype = {
  "control_account": "accounts/system",
  "control_groups": [],
  "control_owner": "members/bLkOyzNbjABj2iaKbOJa",
  "control_permissions_groups": [],
  "control_permissions_member": [],
  "control_permissions_owner": [],
  "control_permissions_public": [],
  "control_permissions_user": [],
  "control_type_logical": "common",
  "control_type_reference": "types/common",
  "control_type_version": 0,
  "control_useraccount": "accounts/VyfFksGi0Ehv7unaMoI0",
  "control_version": 0,
  "counts": {},
  "history": {
    "created": "2018-11-16T05:00:00.000Z",
    "createdby": {
      "member": null,
      "surrogate": null
    },
    "updated": "2018-11-16T05:00:00.000Z",
    "updatedby": {
      "member": null,
      "surrogate": null
    }
  },
  "properties": {
    "model": {
      "agentinterface": {},
      "constraints": {
        "control": {},
        "counts": {},
        "history": {},
        "properties": {},
        "references": {},
        "system": {
          "attributes": {},
          "permissions": {}
        }
      },
      "datatypes": {
        "control_account": "??string",
        "control_groups": "??array",
        "control_owner": "??string",
        "control_permissions_groups": "??array",
        "control_permissions_member": "??array",
        "control_permissions_owner": "??array",
        "control_permissions_public": "??array",
        "control_permissions_user": "??array",
        "control_type_logical": "??string",
        "control_type_reference": "??string",
        "control_type_version": "??integer",
        "control_useraccount": "??string",
        "control_version": "??integer",
        "counts": "??map",
        "history": {
          "created": "??timestamp",
          "createdby": {
            "member": "??string",
            "surrogate": "??string"
          },
          "updated": "??timestamp",
          "updatedby": {
            "member": "??string",
            "surrogate": "??string"
          }
        },
        "references": "??map",
        "standard_dates_end": "??timestamp",
        "standard_dates_start": "??timestamp",
        "standard_name_long": "??string",
        "standard_name_medium": "??string",
        "standard_name_short": "??string",
        "properties": "??map"
      },
      "defaults": {
        "control": {
          "type": {
            "reference": "types/basetype",
            "version": 0
          }
        },
        "history": {
          "version": 0
        }
      },
      "deletions": {
        "versions": {
          "0": []
        }
      },
      "filters": {
        "incoming": {},
        "outgoing": {}
      },
      "triggers": {
        "#description": "refers to LHS through path. Starts with 'document' referencing document, or 'context' referencing shared context. Same for arguments, which are in the form of simple objects.",
        "oncreate": [
          {
            "lhs": "document.history.created",
            "rhs": {
              "arguments": null,
              "function": "now"
            }
          },
          {
            "lhs": "document.history.createdby",
            "rhs": {
              "arguments": null,
              "function": "getuserid"
            }
          }
        ],
        "ondelete": null,
        "onload": null,
        "onunload": null,
        "onupdate": []
      }
    },
    "schema": "system/systemschema",
    "template": {
      "control_account": null,
      "control_groups": null,
      "control_owner": null,
      "control_permissions_groups": [],
      "control_permissions_member": [],
      "control_permissions_owner": [],
      "control_permissions_public": [],
      "control_permissions_user": [],
      "control_type_logical": null,
      "control_type_reference": null,
      "control_type_version": null,
      "control_useraccount": null,
      "control_version": null,
      "counts": {},
      "history": {
        "created": null,
        "createdby": {
          "member": null,
          "surrogate": null
        },
        "updated": null,
        "updatedby": {
          "member": null,
          "surrogate": null
        }
      },
      "properties": {},
      "references": {},
      "standard_dates_end": null,
      "standard_dates_start": null,
      "standard_name_long": null,
      "standard_name_medium": null,
      "standard_name_short": null
    },
    "ui": {
      "#default": null
    }
  },
  "references": {},
  "standard_dates_end": null,
  "standard_dates_start": null,
  "standard_name_long": null,
  "standard_name_medium": null,
  "standard_name_short": null
}

let docpack = {
  reference:'system/parameters',
  document:parameters,
}

let typepack = {
  reference:'types/system',
  document:systemtype,
}

let systemdata = {
  docpack,
  typepack,
}

export default systemdata