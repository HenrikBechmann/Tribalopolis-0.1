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
  }
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
        }
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
      }
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
  }
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