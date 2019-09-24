let parameters = {
  "control": {
    "account": "accounts/system",
    "group": null,
    "owner": "members/bLkOyzNbjABj2iaKbOJa",
    "permissions": {
      "admin": [],
      "group": [],
      "group_admin": [],
      "member": [],
      "owner": [],
      "public": [],
      "user": [
        "get"
      ]
    },
    "status": null,
    "type": {
      "logical": "system",
      "reference": "types/system",
      "version": 0
    },
    "version": 0
  },
  "control_account": "accounts/system",
  "control_group": null,
  "control_owner": "members/bLkOyzNbjABj2iaKbOJa",
  "control_permissions_admin": [],
  "control_permissions_group": [],
  "control_permissions_group_admin": [],
  "control_permissions_member": [],
  "control_permissions_owner": [],
  "control_permissions_public": [],
  "control_permissions_user": [
    "get"
  ],
  "control_status": null,
  "control_type_logical": "system",
  "control_type_reference": "types/system",
  "control_type_version": 0,
  "control_version": 0,
  "counts": {},
  "history": {
    "created": null,
    "createdby": null,
    "updated": null,
    "updatedby": null
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
    "registerpage": "system/register",
    "systemschema": "system/systemschema",
    "tagline": "Tribalopolis is a virtual city of tribes"
  },
  "references": {},
  "standard": {
    "dates": {
      "end": null,
      "start": null
    },
    "names": {
      "long": null,
      "medium": null,
      "short": null
    }
  },
  "standard_dates_end": null,
  "standard_dates_start": null,
  "standard_name_long": null,
  "standard_name_medium": null,
  "standard_name_short": null
}

let systemtype = {
  "control": {
    "account": "accounts/system",
    "group": null,
    "owner": "members/bLkOyzNbjABj2iaKbOJa",
    "permissions": {
      "admin": [],
      "group": [],
      "group_admin": [],
      "member": [],
      "owner": [],
      "public": [],
      "user": [
        "get"
      ]
    },
    "status": null,
    "type": {
      "logical": "common",
      "reference": "types/common",
      "version": 0
    },
    "version": 0
  },
  "control_account": "accounts/system",
  "control_group": null,
  "control_owner": "members/bLkOyzNbjABj2iaKbOJa",
  "control_permissions_admin": [],
  "control_permissions_group": [],
  "control_permissions_group_admin": [],
  "control_permissions_member": [],
  "control_permissions_owner": [],
  "control_permissions_public": [],
  "control_permissions_user": [
    "get"
  ],
  "control_status": null,
  "control_type_logical": "common",
  "control_type_reference": "types/common",
  "control_type_version": 0,
  "control_version": 0,
  "counts": {},
  "history": {
    "created": "2018-11-16T05:00:00.000Z",
    "createdby": null,
    "updated": "2018-11-16T05:00:00.000Z",
    "updatedby": null
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
        "control": {
          "account": "??string",
          "group": "??string",
          "owner": "??string",
          "permissions": {
            "admin": "??array",
            "group": "??array",
            "group_admin": "??array",
            "member": "??array",
            "owner": "??array",
            "public": "??array",
            "user": "??array"
          },
          "status": "??string",
          "type": {
            "logical": "??string",
            "reference": "??string",
            "version": "??integer"
          },
          "version": "??integer"
        },
        "control_account": "??string",
        "control_group": "??string",
        "control_owner": "??string",
        "control_permissions_admin": "??array",
        "control_permissions_group": "??array",
        "control_permissions_group_admin": "??array",
        "control_permissions_member": "??array",
        "control_permissions_owner": "??array",
        "control_permissions_public": "??array",
        "control_permissions_user": "??array",
        "control_status": "??string",
        "control_type_logical": "??string",
        "control_type_reference": "??string",
        "control_type_version": "??integer",
        "control_version": "??integer",
        "counts": "??map",
        "history": {
          "created": "??timestamp",
          "createdby": "??string",
          "updated": "??timestamp",
          "updatedby": "??string"
        },
        "properties": "??map",
        "references": "??map",
        "standard": {
          "dates": {
            "end": "??timestamp",
            "start": "??timestamp"
          },
          "names": {
            "long": "??string",
            "medium": "??string",
            "short": "??string"
          }
        },
        "standard_dates_end": "??timestamp",
        "standard_dates_start": "??timestamp",
        "standard_name_long": "??string",
        "standard_name_medium": "??string",
        "standard_name_short": "??string"
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
      "control": {
        "account": null,
        "group": null,
        "owner": null,
        "permissions": {
          "admin": [],
          "group": [],
          "group_admin": [],
          "member": [],
          "owner": [],
          "public": [],
          "user": []
        },
        "status": null,
        "type": {
          "logical": null,
          "reference": null,
          "version": null
        },
        "version": null
      },
      "control_account": null,
      "control_group": null,
      "control_owner": null,
      "control_permissions_admin": [],
      "control_permissions_group": [],
      "control_permissions_group_admin": [],
      "control_permissions_member": [],
      "control_permissions_owner": [],
      "control_permissions_public": [],
      "control_permissions_user": [],
      "control_status": null,
      "control_type_logical": null,
      "control_type_reference": null,
      "control_type_version": null,
      "control_version": null,
      "counts": {},
      "history": {
        "created": null,
        "createdby": null,
        "updated": null,
        "updatedby": null
      },
      "properties": {},
      "references": {},
      "standard": {
        "dates": {
          "end": null,
          "start": null
        },
        "names": {
          "long": null,
          "medium": null,
          "short": null
        }
      },
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
  "standard": {
    "dates": {
      "end": null,
      "start": null
    },
    "names": {
      "long": null,
      "medium": null,
      "short": null
    }
  },
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