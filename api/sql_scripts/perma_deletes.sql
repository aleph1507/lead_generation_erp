use borce_crm;

DELETE FROM users
WHERE deleted_at < NOW() - INTERVAL 0 DAY;

DELETE FROM clients
WHERE deleted_at < NOW() - INTERVAL 0 DAY;

DELETE FROM leads
WHERE deleted_at < NOW() - INTERVAL 0 DAY;

DELETE FROM messages
WHERE deleted_at < NOW() - INTERVAL 0 DAY;

DELETE FROM responses
WHERE deleted_at < NOW() - INTERVAL 0 DAY;