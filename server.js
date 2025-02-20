const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8080;
const swaggerUi = require('swagger-ui-express');

app.use(express.json());
app.use(express.static(__dirname));

const formatParagraph = (text) => text ? text.replace(/\.\s+/g, ".\n\n") : "Tidak ada jawaban.";

// OpenAPI Specification sebagai String
const swaggerDocument = `
{
  "openapi": "3.0.0",
  "info": {
    "title": "WANZOFC TECH API",
    "version": "1.0.0",
    "description": "DOKUMEN WANZOFC TECH."
  },
  "servers": [
    {
      "url": "https://only-awan.biz.id:${PORT}",
      "description": "Development server"
    }
  ],
  "paths": {
    "/kebijakan": {
      "get": {
        "summary": "Menampilkan halaman kebijakan",
        "description": "Mengirimkan file kebijakan.html",
        "responses": {
          "200": {
            "description": "Berhasil mengirimkan file HTML."
          }
        }
      }
    },
    "/api/ai/deepseek-chat": {
      "get": {
        "summary": "Menggunakan Deepseek Chat AI",
        "description": "Mengembalikan respon dari Deepseek Chat AI berdasarkan query yang diberikan.",
        "parameters": [
          {
            "in": "query",
            "name": "content",
            "schema": {
              "type": "string"
            },
            "description": "Pertanyaan atau teks yang akan diproses oleh AI."
          }
        ],
        "responses": {
          "200": {
            "description": "Respon sukses dari Deepseek Chat AI.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "creator": {
                      "type": "string",
                      "description": "Nama pembuat API."
                    },
                    "result": {
                      "type": "boolean",
                      "description": "Status keberhasilan permintaan."
                    },
                    "message": {
                      "type": "string",
                      "description": "Pesan deskriptif."
                    },
                    "data": {
                      "type": "string",
                      "description": "Hasil dari Deepseek Chat AI."
                    }
                  }
                }
              }
            }
          },
          "500": {
            "description": "Terjadi kesalahan pada server atau Deepseek Chat bermasalah.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "creator": {
                      "type": "string",
                      "description": "Nama pembuat API."
                    },
                    "result": {
                      "type": "boolean",
                      "description": "Status keberhasilan permintaan."
                    },
                    "message": {
                      "type": "string",
                      "description": "Pesan kesalahan."
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/ai/gemini-pro": {
      "get": {
        "summary": "Menggunakan Gemini Pro AI",
        "description": "Mengembalikan respon dari Gemini Pro AI berdasarkan query yang diberikan.",
        "parameters": [
          {
            "in": "query",
            "name": "content",
            "schema": {
              "type": "string"
            },
            "description": "Pertanyaan atau teks yang akan diproses oleh AI."
          }
        ],
        "responses": {
          "200": {
            "description": "Respon sukses dari Gemini Pro AI.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "creator": {
                      "type": "string",
                      "description": "Nama pembuat API."
                    },
                    "result": {
                      "type": "boolean",
                      "description": "Status keberhasilan permintaan."
                    },
                    "message": {
                      "type": "string",
                      "description": "Pesan deskriptif."
                    },
                    "data": {
                      "type": "string",
                      "description": "Hasil dari Gemini Pro AI."
                    }
                  }
                }
              }
            }
          },
          "500": {
            "description": "Terjadi kesalahan pada server atau Gemini Pro bermasalah.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "creator": {
                      "type": "string",
                      "description": "Nama pembuat API."
                    },
                    "result": {
                      "type": "boolean",
                      "description": "Status keberhasilan permintaan."
                    },
                    "message": {
                      "type": "string",
                      "description": "Pesan kesalahan."
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/ai/meta-llama": {
      "get": {
        "summary": "Menggunakan Meta Llama AI",
        "description": "Mengembalikan respon dari Meta Llama AI berdasarkan query yang diberikan.",
        "parameters": [
          {
            "in": "query",
            "name": "content",
            "schema": {
              "type": "string"
            },
            "description": "Pertanyaan atau teks yang akan diproses oleh AI."
          }
        ],
        "responses": {
          "200": {
            "description": "Respon sukses dari Meta Llama AI.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "creator": {
                      "type": "string",
                      "description": "Nama pembuat API."
                    },
                    "result": {
                      "type": "boolean",
                      "description": "Status keberhasilan permintaan."
                    },
                    "message": {
                      "type": "string",
                      "description": "Pesan deskriptif."
                    },
                    "data": {
                      "type": "string",
                      "description": "Hasil dari Meta Llama AI."
                    }
                  }
                }
              }
            }
          },
          "500": {
            "description": "Terjadi kesalahan pada server atau Meta Llama bermasalah.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "creator": {
                      "type": "string",
                      "description": "Nama pembuat API."
                    },
                    "result": {
                      "type": "boolean",
                      "description": "Status keberhasilan permintaan."
                    },
                    "message": {
                      "type": "string",
                      "description": "Pesan kesalahan."
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/ai/dbrx-instruct": {
      "get": {
        "summary": "Menggunakan DBRX Instruct AI",
        "description": "Mengembalikan respon dari DBRX Instruct AI berdasarkan query yang diberikan.",
        "parameters": [
          {
            "in": "query",
            "name": "content",
            "schema": {
              "type": "string"
            },
            "description": "Pertanyaan atau teks yang akan diproses oleh AI."
          }
        ],
        "responses": {
          "200": {
            "description": "Respon sukses dari DBRX Instruct AI.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "creator": {
                      "type": "string",
                      "description": "Nama pembuat API."
                    },
                    "result": {
                      "type": "boolean",
                      "description": "Status keberhasilan permintaan."
                    },
                    "message": {
                      "type": "string",
                      "description": "Pesan deskriptif."
                    },
                    "data": {
                      "type": "string",
                      "description": "Hasil dari DBRX Instruct AI."
                    }
                  }
                }
              }
            }
          },
          "500": {
            "description": "Terjadi kesalahan pada server atau DBRX Instruct bermasalah.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "creator": {
                      "type": "string",
                      "description": "Nama pembuat API."
                    },
                    "result": {
                      "type": "boolean",
                      "description": "Status keberhasilan permintaan."
                    },
                    "message": {
                      "type": "string",
                      "description": "Pesan kesalahan."
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/ai/deepseek-r1": {
      "get": {
        "summary": "Menggunakan Deepseek R1 AI",
        "description": "Mengembalikan respon dari Deepseek R1 AI berdasarkan query yang diberikan.",
        "parameters": [
          {
            "in": "query",
            "name": "content",
            "schema": {
              "type": "string"
            },
            "description": "Pertanyaan atau teks yang akan diproses oleh AI."
          }
        ],
        "responses": {
          "200": {
            "description": "Respon sukses dari Deepseek R1 AI.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "creator": {
                      "type": "string",
                      "description": "Nama pembuat API."
                    },
                    "result": {
                      "type": "boolean",
                      "description": "Status keberhasilan permintaan."
                    },
                    "message": {
                      "type": "string",
                      "description": "Pesan deskriptif."
                    },
                    "data": {
                      "type": "string",
                      "description": "Hasil dari Deepseek R1 AI."
                    }
                  }
                }
              }
            }
          },
          "500": {
            "description": "Terjadi kesalahan pada server atau Deepseek R1 bermasalah.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "creator": {
                      "type": "string",
                      "description": "Nama pembuat API."
                    },
                    "result": {
                      "type": "boolean",
                      "description": "Status keberhasilan permintaan."
                    },
                    "message": {
                      "type": "string",
                      "description": "Pesan kesalahan."
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/gita": {
      "get": {
        "summary": "Berinteraksi dengan Gita AI",
        "description": "Mengembalikan respon dari Gita AI berdasarkan query yang diberikan.",
        "parameters": [
          {
            "in": "query",
            "name": "q",
            "schema": {
              "type": "string"
            },
            "description": "Pertanyaan atau teks yang akan diproses oleh AI Gita."
          }
        ],
        "responses": {
          "200": {
            "description": "Respon sukses dari Gita AI.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "creator": {
                      "type": "string",
                      "description": "Nama pembuat API."
                    },
                    "result": {
                      "type": "boolean",
                      "description": "Status keberhasilan permintaan."
                    },
                    "message": {
                      "type": "string",
                      "description": "Pesan deskriptif."
                    },
                    "data": {
                      "type": "string",
                      "description": "Hasil dari Gita AI."
                    }
                  }
                }
              }
            }
          },
          "500": {
            "description": "Terjadi kesalahan pada server atau Gita AI bermasalah.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "creator": {
                      "type": "string",
                      "description": "Nama pembuat API."
                    },
                    "result": {
                      "type": "boolean",
                      "description": "Status keberhasilan permintaan."
                    },
                    "message": {
                      "type": "string",
                      "description": "Pesan kesalahan."
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
`;

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(JSON.parse(swaggerDocument)));

app.get("/kebijakan", (req, res) => {
    res.sendFile(path.join(__dirname, "kebijakan.html"));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/ai/deepseek-chat', async (req, res) => {
    const query = req.query.content || "halo";
    try {
        const { data } = await axios.get(`https://api.siputzx.my.id/api/ai/deepseek-llm-67b-chat?content=${encodeURIComponent(query)}`);
        res.json({ creator: "WANZOFC TECH", result: true, message: "Deepseek Chat", data: formatParagraph(data?.data) });
    } catch (error) {
        console.error("Error in /api/ai/deepseek-chat:", error);
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Deepseek Chat bermasalah.", error: error.message });
    }
});

app.get('/api/ai/gemini-pro', async (req, res) => {
    const query = req.query.content || "hai";
    try {
        const { data } = await axios.get(`https://api.siputzx.my.id/api/ai/gemini-pro?content=${encodeURIComponent(query)}`);
        res.json
           ({ creator: "WANZOFC TECH",
             result: true, message: "Gemini Pro AI",
             data: formatParagraph(data?.data) });
    } catch (error) {
         console.error("Error in /api/ai/gemini-pro:", error);
        res.status(500).json
            ({ creator: "WANZOFC TECH",
              result: false, 
              message: "Gemini Pro bermasalah.", error: error.message });
    }
});

app.get('/api/ai/meta-llama', async (req, res) => {
    const query = req.query.content || "hai";
    try {
        const { data } = await axios.get(`https://api.siputzx.my.id/api/ai/meta-llama-33-70B-instruct-turbo?content=${encodeURIComponent(query)}`);
        res.json({ creator: "WANZOFC TECH", result: true, message: "Meta Llama", data: formatParagraph(data?.data) });
    } catch (error) {
        console.error("Error in /api/ai/meta-llama:", error);
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Meta Llama bermasalah.", error: error.message });
    }
});

app.get('/api/ai/dbrx-instruct', async (req, res) => {
    const query = req.query.content || "hai";
    try {
        const { data } = await axios.get(`https://api.siputzx.my.id/api/ai/dbrx-instruct?content=${encodeURIComponent(query)}`);
        res.json({ creator: "WANZOFC TECH", result: true, message: "DBRX Instruct", data: formatParagraph(data?.data) });
    } catch (error) {
        console.error("Error in /api/ai/dbrx-instruct:", error);
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "DBRX Instruct bermasalah.", error: error.message });
    }
});

app.get('/api/ai/deepseek-r1', async (req, res) => {
    const query = req.query.content || "hai";
    try {
        const { data } = await axios.get(`https://api.siputzx.my.id/api/ai/deepseek-r1?content=${encodeURIComponent(query)}`);
        res.json({ creator: "WANZOFC TECH", result: true, message: "Deepseek R1", data: formatParagraph(data?.data) });
    } catch (error) {
         console.error("Error in /api/ai/deepseek-r1:", error);
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Deepseek R1 bermasalah.", error: error.message });
    }
});

app.get('/api/gita', async (req, res) => {
    const query = req.query.q || "apa itu dosa";
    try {
        const { data } = await axios.get(`https://api.siputzx.my.id/api/gita?q=${encodeURIComponent(query)}`);
        res.json({ creator: "WANZOFC TECH", result: true, message: "Gita AI", data: formatParagraph(data?.data) });
    } catch (error) {
         console.error("Error in /api/gita:", error);
        res.status(500).json({ creator: "WANZOFC TECH", result: false, message: "Gita AI bermasalah.", error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
    console.log(`Swagger UI tersedia di http://localhost:${PORT}/api-docs`);
});
